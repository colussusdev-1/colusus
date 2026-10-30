import mongoose from "mongoose";

import Assessment from "./assessment.model.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const ASSESSMENT_FEE = 50000;

const ASSESSMENT_CURRENCY = "NGN";

/* -------------------------------------------------------------------------- */
/* ERROR HELPER                                                               */
/* -------------------------------------------------------------------------- */

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/* -------------------------------------------------------------------------- */
/* COMPLETE ASSESSMENT PAYMENT                                                */
/* -------------------------------------------------------------------------- */

/**
 * Called by the Finance payment workflow after:
 *
 * 1. Paystack confirms successful payment.
 * 2. The invoice is updated.
 * 3. The receipt is generated.
 * 4. The invoice reaches PAID.
 *
 * Expected invoice context:
 *
 * {
 *   flow: "TRAINEE_ASSESSMENT",
 *   assessmentId: "...",
 *   assessmentReference: "...",
 *   opportunityId: "...",
 *   opportunityTitle: "..."
 * }
 *
 * This handler must remain idempotent because payment verification
 * and webhook notifications can occur more than once.
 */

const completeAssessmentPayment = async ({
  payment,
  invoice,
  receipt,
  session,
}) => {
  /* ------------------------------------------------------------------------ */
  /* VALIDATE INPUT                                                           */
  /* ------------------------------------------------------------------------ */

  if (!payment || !invoice || !receipt) {
    throw createError(
      "Assessment payment completion requires payment, invoice and receipt records.",
      500,
    );
  }

  if (!session) {
    throw createError(
      "A MongoDB transaction session is required for assessment payment completion.",
      500,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE PAYMENT                                                         */
  /* ------------------------------------------------------------------------ */

  if (payment.status !== "SUCCESS") {
    throw createError("Only successful payments can complete an assessment.");
  }

  if (payment.paymentType !== "ASSESSMENT") {
    throw createError("Payment is not an assessment payment.");
  }

  if (Number(payment.amount) !== ASSESSMENT_FEE) {
    throw createError("Assessment payment must be exactly ₦50,000.");
  }

  if (String(payment.currency || "").toUpperCase() !== ASSESSMENT_CURRENCY) {
    throw createError("Assessment payment currency must be NGN.");
  }

  if (!payment.reference) {
    throw createError(
      "A valid payment reference is required to complete the assessment.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE INVOICE                                                         */
  /* ------------------------------------------------------------------------ */

  if (invoice.invoiceType !== "ASSESSMENT") {
    throw createError("Invoice is not an assessment invoice.");
  }

  if (invoice.status !== "PAID") {
    throw createError(
      "Assessment invoice must be fully paid before submission.",
    );
  }

  if (Number(invoice.total) !== ASSESSMENT_FEE) {
    throw createError(
      "Assessment invoice amount does not match the assessment fee.",
    );
  }

  if (Number(invoice.amountPaid) < ASSESSMENT_FEE) {
    throw createError(
      "Assessment invoice has not received the full assessment fee.",
    );
  }

  if (String(invoice.currency || "").toUpperCase() !== ASSESSMENT_CURRENCY) {
    throw createError("Assessment invoice currency must be NGN.");
  }

  if (String(payment.invoice) !== String(invoice._id)) {
    throw createError(
      "Payment does not belong to the supplied assessment invoice.",
    );
  }

  if (String(payment.customerId) !== String(invoice.customerId)) {
    throw createError(
      "Payment customer does not match the invoice customer.",
      403,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE ASSESSMENT CONTEXT                                              */
  /* ------------------------------------------------------------------------ */

  const context = invoice.context || {};

  if (context.flow !== "TRAINEE_ASSESSMENT") {
    throw createError(
      "Invoice does not belong to the trainee assessment payment flow.",
    );
  }

  const assessmentId = context.assessmentId;

  if (!assessmentId || !mongoose.isValidObjectId(assessmentId)) {
    throw createError(
      "A valid assessment ID is missing from the invoice context.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD ASSESSMENT                                                          */
  /* ------------------------------------------------------------------------ */

  const assessment = await Assessment.findById(assessmentId).session(session);

  if (!assessment) {
    throw createError(
      "Assessment associated with this invoice could not be found.",
      404,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE ASSESSMENT OWNERSHIP                                            */
  /* ------------------------------------------------------------------------ */

  if (String(assessment.client) !== String(invoice.customerId)) {
    throw createError(
      "Assessment does not belong to the invoice customer.",
      403,
    );
  }

  if (String(assessment.invoice) !== String(invoice._id)) {
    throw createError("Assessment is not linked to this invoice.");
  }

  if (assessment.reference !== context.assessmentReference) {
    throw createError(
      "Assessment reference does not match the invoice context.",
    );
  }

  if (String(assessment.opportunity) !== String(context.opportunityId)) {
    throw createError(
      "Assessment opportunity does not match the invoice context.",
    );
  }

  if (Number(assessment.assessmentFee) !== ASSESSMENT_FEE) {
    throw createError(
      "Assessment fee does not match the configured assessment fee.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* IDEMPOTENCY CHECK                                                        */
  /* ------------------------------------------------------------------------ */

  if (
    assessment.paymentStatus === "PAID" &&
    assessment.submissionStatus === "SUBMITTED"
  ) {
    /*
     * Repeated webhook or verification.
     *
     * Do not overwrite an existing successful payment with a
     * different payment record.
     */

    if (
      String(assessment.payment) !== String(payment._id) ||
      assessment.paymentReference !== payment.reference
    ) {
      throw createError(
        "This assessment has already been paid using a different payment.",
        409,
      );
    }

    return {
      success: true,

      alreadyCompleted: true,

      assessmentId: assessment._id,

      assessmentReference: assessment.reference,

      submissionStatus: assessment.submissionStatus,

      paymentStatus: assessment.paymentStatus,

      paymentReference: assessment.paymentReference,
    };
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE CURRENT ASSESSMENT STATE                                         */
  /* ------------------------------------------------------------------------ */

  if (
    assessment.submissionStatus !== "PENDING_PAYMENT" &&
    assessment.submissionStatus !== "SUBMITTED"
  ) {
    throw createError("Assessment is not awaiting payment.");
  }

  if (
    assessment.paymentStatus === "PAID" &&
    String(assessment.payment || "") !== String(payment._id)
  ) {
    throw createError(
      "Assessment is already associated with another successful payment.",
      409,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* COMPLETE ASSESSMENT PAYMENT                                              */
  /* ------------------------------------------------------------------------ */

  assessment.paymentStatus = "PAID";

  assessment.payment = payment._id;

  assessment.paymentReference = payment.reference;

  assessment.paidAt = payment.paidAt || new Date();

  assessment.submissionStatus = "SUBMITTED";

  assessment.submittedAt = assessment.submittedAt || new Date();

  /*
   * Payment does not automatically qualify an applicant.
   * The assessment remains PENDING until an administrator reviews it.
   */

  if (!assessment.status) {
    assessment.status = "PENDING";
  }

  await assessment.save({
    session,
  });

  /* ------------------------------------------------------------------------ */
  /* RESULT                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    success: true,

    alreadyCompleted: false,

    assessmentId: assessment._id,

    assessmentReference: assessment.reference,

    opportunityId: assessment.opportunity,

    paymentId: payment._id,

    paymentReference: payment.reference,

    invoiceId: invoice._id,

    receiptId: receipt._id,

    paymentStatus: assessment.paymentStatus,

    submissionStatus: assessment.submissionStatus,

    assessmentStatus: assessment.status,

    paidAt: assessment.paidAt,

    submittedAt: assessment.submittedAt,
  };
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default completeAssessmentPayment;
