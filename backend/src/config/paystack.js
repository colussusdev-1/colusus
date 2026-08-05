import axios from "axios";
import config from "./environment.js";

console.log("================================");
console.log("PAYSTACK CONFIG");
console.log("================================");
console.log("Base URL:", config.paystackBaseUrl);
console.log(
  "Secret Key:",
  config.paystackSecretKey
    ? `${config.paystackSecretKey.substring(0, 12)}...`
    : "UNDEFINED",
);

const paystack = axios.create({
  baseURL: config.paystackBaseUrl,
  headers: {
    Authorization: `Bearer ${config.paystackSecretKey}`,
    "Content-Type": "application/json",
  },
});

export default paystack;
