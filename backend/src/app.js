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

/* -------------------------------------------------------------------------- */
/* FINANCE                                                                   */
/* -------------------------------------------------------------------------- */

import paymentRoutes from "./modules/finance/payments/payment.routes.js";
import invoiceRoutes from "./modules/finance/invoices/invoice.routes.js";
import receiptRoutes from "./modules/finance/reciepts/reciept.routes.js";
import financeAdminRoutes from "./modules/finance/finance.admin.routes.js";

/*
 * Business-owned payment workflow registrations.
 *
 * Finance remains generic and does not import Application/Booking/Opportunity
 * modules directly. These modules register their own completion handlers here.
 */
import "./modules/applications/application.payment.workflow.js";

/* -------------------------------------------------------------------------- */
/* BLOG                                                                      */
/* -------------------------------------------------------------------------- */

import {
  publicRoutes as blogPublicRoutes,
  adminRoutes as blogAdminRoutes,
} from "./modules/blog/index.js";

const app = express();

/* -------------------------------------------------------------------------- */
/* GLOBAL MIDDLEWARE                                                         */
/* -------------------------------------------------------------------------- */

app.use(helmet());

/* -------------------------------------------------------------------------- */
/* CORS                                                                      */
/* -------------------------------------------------------------------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:5173",
  "https://www.colossusmigration.com",
  "https://colossusmigration.com",
  config.clientUrl,
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ""))
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

  const normalizedOrigin = origin.trim().replace(/\/$/, "");

  if (allowedOrigins.includes(normalizedOrigin)) {
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
    if (allowedOrigins.includes(normalizedOrigin)) {
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

      const normalizedOrigin = origin.trim().replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (normalizedOrigin.startsWith("http://localhost:")) {
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

/* -------------------------------------------------------------------------- */
/* PAYSTACK WEBHOOK                                                          */
/* -------------------------------------------------------------------------- */

/*
 * Paystack webhook must receive the raw request body before express.json()
 * so the HMAC signature can be verified.
 */

app.use(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json",
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

app.use(morgan("dev"));

/* -------------------------------------------------------------------------- */
/* HEALTH CHECK / ROOT ROUTE                                                 */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running on LAN",
  });
});

/* -------------------------------------------------------------------------- */
/* CORE API ROUTES                                                           */
/* -------------------------------------------------------------------------- */

app.use("/api/v1", routes);

/* -------------------------------------------------------------------------- */
/* PAYMENT & BILLING INFRASTRUCTURE                                          */
/* -------------------------------------------------------------------------- */

/*
 * Generic financial infrastructure.
 *
 * Payments:
 *   /api/v1/payments/*
 *
 * Invoices:
 *   /api/v1/invoices/*
 *
 * Receipts:
 *   /api/v1/receipts/*
 *
 * Business modules such as Application, Opportunity and Booking consume
 * this infrastructure rather than owning payment processing logic.
 */

app.use("/api/v1/payments", paymentRoutes);

app.use("/api/v1/invoices", invoiceRoutes);

app.use("/api/v1/receipts", receiptRoutes);

/* -------------------------------------------------------------------------- */
/* ADMIN FINANCE MONITORING                                                  */
/* -------------------------------------------------------------------------- */

/*
 * Centralized admin financial monitoring.
 *
 * Overview:
 *   /api/v1/admin/finance/overview
 *
 * Invoices:
 *   /api/v1/admin/finance/invoices/*
 *
 * Payments:
 *   /api/v1/admin/finance/payments/*
 *
 * Receipts:
 *   /api/v1/admin/finance/receipts
 *
 * Access is restricted to authenticated ADMIN users
 * inside finance.admin.routes.js.
 */

app.use("/api/v1/admin/finance", financeAdminRoutes);

/* -------------------------------------------------------------------------- */
/* CONTACT ROUTES                                                            */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/* CONSULTATION ROUTES                                                       */
/* -------------------------------------------------------------------------- */

app.use("/api/v1/admin/consultations", consultationRoutes);

/* -------------------------------------------------------------------------- */
/* ADMIN DOCUMENT ROUTES                                                     */
/* -------------------------------------------------------------------------- */

app.use("/api/v1/admin/documents", adminDocumentRoutes);

/* -------------------------------------------------------------------------- */
/* BLOG MODULE                                                               */
/* -------------------------------------------------------------------------- */

app.use("/api/v1/blog", blogPublicRoutes);

app.use("/api/v1/admin/blog", blogAdminRoutes);

/* -------------------------------------------------------------------------- */
/* 404 HANDLER                                                               */
/* -------------------------------------------------------------------------- */

app.use(notFound);

/* -------------------------------------------------------------------------- */
/* GLOBAL ERROR HANDLER                                                      */
/* -------------------------------------------------------------------------- */

app.use(errorHandler);

export default app;
