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

console.log("=================================");
console.log("CORS CONFIGURATION");
console.log("=================================");
console.log("Allowed Origins:", allowedOrigins);
console.log("CLIENT_URL:", config.clientUrl);
console.log("=================================");

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return next();
  }

  const normalizedOrigin = origin.trim().replace(/\/+$/, "");

  if (
    allowedOrigins.includes(normalizedOrigin) ||
    /^http:\/\/localhost:\d+$/.test(normalizedOrigin)
  ) {
    res.header("Access-Control-Allow-Origin", normalizedOrigin);
    res.header("Access-Control-Allow-Credentials", "true");

    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );

    res.header("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    if (
      allowedOrigins.includes(normalizedOrigin) ||
      /^http:\/\/localhost:\d+$/.test(normalizedOrigin)
    ) {
      return res.sendStatus(204);
    }

    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/+$/, "");

      if (
        allowedOrigins.includes(normalizedOrigin) ||
        /^http:\/\/localhost:\d+$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      console.error("CORS BLOCKED ORIGIN:", normalizedOrigin);

      return callback(
        new Error(`CORS blocked for origin: ${normalizedOrigin}`),
      );
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

app.use(compression());

/* ==========================================================================
   PAYSTACK WEBHOOK
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

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
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
   ========================================================================== |
   Public:
     POST  /api/v1/assessments

   Admin:
     GET   /api/v1/assessments/admin
     GET   /api/v1/assessments/admin/:id
     PATCH /api/v1/assessments/admin/:id/status
     PATCH /api/v1/assessments/admin/:id/notes
   ========================================================================== */

app.use("/api/v1/assessments", assessmentRoutes);

/* ==========================================================================
   404 HANDLER
   ========================================================================== */

app.use(notFound);

/* ==========================================================================
   GLOBAL ERROR HANDLER
   ========================================================================== */

app.use(errorHandler);

export default app;
