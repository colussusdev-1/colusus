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

import {
  publicRoutes as blogPublicRoutes,
  adminRoutes as blogAdminRoutes,
} from "./modules/blog/index.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
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

/*
|--------------------------------------------------------------------------
| Paystack Webhook
|--------------------------------------------------------------------------
|
| Webhook must receive the raw request body before express.json().
|--------------------------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| Health Check / Root Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running on LAN",
  });
});

/*
|--------------------------------------------------------------------------
| Core API Routes
|--------------------------------------------------------------------------
|
| General application routes.
|
| /api/v1/*
|
|--------------------------------------------------------------------------
*/

app.use("/api/v1", routes);

/*
|--------------------------------------------------------------------------
| Contact Routes
|--------------------------------------------------------------------------
*/

app.use("/api/contact", contactRoutes);

/*
|--------------------------------------------------------------------------
| Consultation Routes
|--------------------------------------------------------------------------
|
| /api/v1/admin/consultations/*
|
|--------------------------------------------------------------------------
*/

app.use("/api/v1/admin/consultations", consultationRoutes);

/*
|--------------------------------------------------------------------------
| Admin Document Routes
|--------------------------------------------------------------------------
|
| /api/v1/admin/documents/*
|
| Includes:
|
| GET    /api/v1/admin/documents
| GET    /api/v1/admin/documents/application/:applicationId
| GET    /api/v1/admin/documents/status/:status
| GET    /api/v1/admin/documents/:id/view
| GET    /api/v1/admin/documents/:id
| PATCH  /api/v1/admin/documents/:id/status
|
|--------------------------------------------------------------------------
*/

app.use("/api/v1/admin/documents", adminDocumentRoutes);

/*
|--------------------------------------------------------------------------
| Blog Module
|--------------------------------------------------------------------------
|
| Public:
|   /api/v1/blog/*
|
| Admin:
|   /api/v1/admin/blog/*
|
|--------------------------------------------------------------------------
*/

app.use("/api/v1/blog", blogPublicRoutes);

app.use("/api/v1/admin/blog", blogAdminRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
