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

import testCloudinary from "./utils/testCloudinary.js";

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

/*
|--------------------------------------------------------------------------
| Explicit CORS / Preflight Middleware
|--------------------------------------------------------------------------
|
| We handle OPTIONS requests explicitly here.
|
| This is important because the browser sends an OPTIONS
| preflight request before authenticated API requests.
|
|--------------------------------------------------------------------------
*/

app.use((req, res, next) => {
  const origin = req.headers.origin;

  /*
    |--------------------------------------------------------------------------
    | No Origin
    |--------------------------------------------------------------------------
    */

  if (!origin) {
    return next();
  }

  const normalizedOrigin = origin.trim().replace(/\/$/, "");

  /*
    |--------------------------------------------------------------------------
    | Allowed Origin
    |--------------------------------------------------------------------------
    */

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

  /*
    |--------------------------------------------------------------------------
    | OPTIONS / PREFLIGHT
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| CORS Package
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: (origin, callback) => {
      /*
            |----------------------------------------------------------------------
            | Requests without Origin
            |----------------------------------------------------------------------
            */

      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/$/, "");

      /*
            |----------------------------------------------------------------------
            | Allowed Origins
            |----------------------------------------------------------------------
            */

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      /*
            |----------------------------------------------------------------------
            | Localhost Development
            |----------------------------------------------------------------------
            */

      if (normalizedOrigin.startsWith("http://localhost:")) {
        return callback(null, true);
      }

      /*
            |----------------------------------------------------------------------
            | Block Unknown Origin
            |----------------------------------------------------------------------
            */

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

/*
|--------------------------------------------------------------------------
| Compression
|--------------------------------------------------------------------------
*/

app.use(compression());

/*
|--------------------------------------------------------------------------
| Paystack Webhook
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Paystack webhook must receive the raw request body.
|
| This MUST remain before express.json().
|
|--------------------------------------------------------------------------
*/

app.use(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json",
  }),
);

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/*
|--------------------------------------------------------------------------
| Cookies
|--------------------------------------------------------------------------
*/

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| HTTP Logging
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/v1", routes);

/*
|--------------------------------------------------------------------------
| Contact Form
|--------------------------------------------------------------------------
*/

app.use("/api/contact", contactRoutes);

/*
|--------------------------------------------------------------------------
| Admin Consultation Module
|--------------------------------------------------------------------------
|
| Protected inside consultation.routes.js
|
| GET /api/v1/admin/consultations
| GET /api/v1/admin/consultations/:id
|
|--------------------------------------------------------------------------
*/

app.use("/api/v1/admin/consultations", consultationRoutes);

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
