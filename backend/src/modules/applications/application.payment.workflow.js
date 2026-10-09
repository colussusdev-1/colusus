import applicationService from "./application.service.js";

import paymentWorkflowRegistry from "../finance/payment.workflow.registry.js";

/* -------------------------------------------------------------------------- */
/* APPLICATION PAYMENT WORKFLOW                                               */
/* -------------------------------------------------------------------------- */

/**
 * Complete an application payment stage after Finance has fully paid the
 * corresponding application invoice.
 *
 * Finance owns:
 *
 * - Paystack verification
 * - Payment
 * - Invoice
 * - Receipt
 *
 * Application owns:
 *
 * - Payment stages
 * - Stage progression
 * - Unlocking the next stage
 * - Creating the next stage invoice
 * - Completing the application payment plan
 */
const completeApplicationPayment = async ({
  payment,
  invoice,
  receipt,
  session,
}) => {
  if (!invoice?._id) {
    const error = new Error(
      "Application payment workflow requires a valid invoice.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* APPLICATION ID                                                           */
  /* ------------------------------------------------------------------------ */

  const applicationId =
    invoice.context?.applicationId ||
    invoice.metadata?.applicationId ||
    payment?.context?.applicationId ||
    payment?.metadata?.applicationId;

  if (!applicationId) {
    const error = new Error(
      "Application payment invoice is missing applicationId.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* COMPLETE APPLICATION PAYMENT STAGE                                      */
  /* ------------------------------------------------------------------------ */

  return applicationService.completeApplicationPaymentStage({
    applicationId,
    invoice,
    payment,
    receipt,
    session,
  });
};

/* -------------------------------------------------------------------------- */
/* REGISTER                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Register the Application business workflow with Finance.
 *
 * This is deliberately done from the Application module.
 *
 * Finance therefore remains completely unaware of the Application module.
 */
paymentWorkflowRegistry.registerPaymentWorkflow(
  "APPLICATION",
  completeApplicationPayment,
);

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                      */
/* -------------------------------------------------------------------------- */

export default completeApplicationPayment;
