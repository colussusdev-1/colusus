import express from "express";

import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
} from "./payment.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Payment Initialization
|--------------------------------------------------------------------------
*/

router.post("/initialize", initializePayment);

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

router.get("/verify/:reference", verifyPayment);

/*
|--------------------------------------------------------------------------
| Paystack Webhook
|--------------------------------------------------------------------------
*/

router.post("/webhook", paystackWebhook);

export default router;
