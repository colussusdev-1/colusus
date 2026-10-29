
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import config from "./config/environment.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

import routes from "./routes/index.js";
import contactRoutes from "./routes/contactRoutes.js";
import consultationRoutes from "./modules/consultations/consultation.routes.js";
import adminDocumentRoutes from "./modules/admin/admin.document.routes.js";
import paymentRoutes from "./modules/finance/payments/payment.routes.js";
import invoiceRoutes from "./modules/finance/invoices/invoice.routes.js";
import receiptRoutes from "./modules/finance/reciepts/reciept.routes.js";
import financeAdminRoutes from "./modules/finance/finance.admin.routes.js";

import "./modules/applications/application.payment.workflow.js";

import assessmentRoutes from "./modules/assessment/assessment.routes.js";

import {
  publicRoutes as blogPublicRoutes,
  adminRoutes as blogAdminRoutes,
} from "./modules/blog/index.js";

// CHAT MODULE
import chatRoutes from "./modules/chat/chat.routes.js";

const app = express();

/* ==========================================================================
   SECURITY
   ========================================================================== */

app.use(helmet());

/* ==========================================================================
   CORS
   ========================================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:5173",
  "https://www.colossusmigration.com",
  "https://colossusmigration.com",
  config.clientUrl,
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter((origin, index, array) => array.indexOf(origin) === index);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.trim().replace(/\/+$/, "");

  return (
    allowedOrigins.includes(normalizedOrigin) ||
    /^https?:\/\/localhost:\d+$/.test(normalizedOrigin)
  );
};

console.log("=================================");
console.log("CORS CONFIGURATION");
console.log("=================================");
console.log("Allowed Origins:", allowedOrigins);
console.log("CLIENT_URL:", config.clientUrl);
console.log("=================================");

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      console.error("CORS BLOCKED ORIGIN:", origin);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    optionsSuccessStatus: 204,
  }),
);

/* ==========================================================================
   COMPRESSION
   ========================================================================== */

app.use(compression());

/* ==========================================================================
   PAYSTACK WEBHOOK
   Keep raw-body parsing before express.json().
   ========================================================================== */

app.use(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json",
  }),
);

/* ==========================================================================
   BODY PARSING
   ========================================================================== */

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(cookieParser());
app.use(morgan("dev"));

/* ==========================================================================
   HEALTH CHECK
   ========================================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running on LAN",
  });
});

/* ==========================================================================
   CORE API ROUTES
   ========================================================================== */

app.use("/api/v1", routes);

/* ==========================================================================
   PAYMENT & BILLING
   ========================================================================== */

app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/receipts", receiptRoutes);

/* ==========================================================================
   ADMIN FINANCE
   ========================================================================== */

app.use("/api/v1/admin/finance", financeAdminRoutes);

/* ==========================================================================
   CONSULTATIONS
   ========================================================================== */

app.use("/api/v1/admin/consultations", consultationRoutes);

/* ==========================================================================
   ADMIN DOCUMENTS
   ========================================================================== */

app.use("/api/v1/admin/documents", adminDocumentRoutes);

/* ==========================================================================
   BLOG
   ========================================================================== */

app.use("/api/v1/blog", blogPublicRoutes);
app.use("/api/v1/admin/blog", blogAdminRoutes);

/* ==========================================================================
   ASSESSMENTS
   ========================================================================== */

app.use("/api/v1/assessments", assessmentRoutes);

/* ==========================================================================
   CHAT MODULE
   Admin ↔ Client messaging and document communication.
   ========================================================================== */

app.use("/api/v1/chat", chatRoutes);

/* ==========================================================================
   404 HANDLER
   ========================================================================== */

app.use(notFound);

/* ==========================================================================
   GLOBAL ERROR HANDLER
   ========================================================================== */

app.use(errorHandler);

export default app;

