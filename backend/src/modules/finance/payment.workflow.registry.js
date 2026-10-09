/* -------------------------------------------------------------------------- */
/* PAYMENT WORKFLOW REGISTRY                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Business modules register their payment-completion handlers here.
 *
 * Finance does not import business modules directly.
 *
 * Example:
 *
 * registerPaymentWorkflow("APPLICATION", async ({ payment, invoice }) => {
 *   ...
 * });
 *
 * This keeps Finance generic while allowing business modules to react when
 * their invoice becomes fully PAID.
 */

const workflows = new Map();

/* -------------------------------------------------------------------------- */
/* REGISTER                                                                   */
/* -------------------------------------------------------------------------- */

const registerPaymentWorkflow = (invoiceType, handler) => {
  if (!invoiceType || typeof invoiceType !== "string") {
    throw new Error("A valid invoice type is required.");
  }

  if (typeof handler !== "function") {
    throw new Error(`Payment workflow for ${invoiceType} must be a function.`);
  }

  const normalizedType = invoiceType.trim().toUpperCase();

  if (workflows.has(normalizedType)) {
    throw new Error(
      `A payment workflow is already registered for ${normalizedType}.`,
    );
  }

  workflows.set(normalizedType, handler);

  return handler;
};

/* -------------------------------------------------------------------------- */
/* GET                                                                        */
/* -------------------------------------------------------------------------- */

const getPaymentWorkflow = (invoiceType) => {
  if (!invoiceType) {
    return null;
  }

  return workflows.get(String(invoiceType).trim().toUpperCase()) || null;
};

/* -------------------------------------------------------------------------- */
/* HAS                                                                        */
/* -------------------------------------------------------------------------- */

const hasPaymentWorkflow = (invoiceType) => {
  return Boolean(getPaymentWorkflow(invoiceType));
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default {
  registerPaymentWorkflow,

  getPaymentWorkflow,

  hasPaymentWorkflow,
};
