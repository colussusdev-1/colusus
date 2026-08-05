const generatePaymentReference = (prefix = "COL") => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

export default generatePaymentReference;
