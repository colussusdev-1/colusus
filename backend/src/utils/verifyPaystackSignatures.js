import crypto from "crypto";
import config from "../config/environment.js";

const verifyPaystackSignature = (signature, payload) => {
  const hash = crypto
    .createHmac("sha512", config.paystackSecretKey)
    .update(payload)
    .digest("hex");

  return hash === signature;
};

export default verifyPaystackSignature;
