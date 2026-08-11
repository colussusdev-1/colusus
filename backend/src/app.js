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
    "https://www.colossusmigration.com",
    "https://colossusmigration.com",
    config.clientUrl,
].filter(Boolean);

console.log("=================================");
console.log("CORS CONFIGURATION");
console.log("=================================");
console.log("Allowed Origins:", allowedOrigins);
console.log("CLIENT_URL:", config.clientUrl);
console.log("=================================");

app.use(
    cors({
        origin: (origin, callback) => {

            /*
            |--------------------------------------------------------------------------
            | Allow requests without Origin
            |--------------------------------------------------------------------------
            |
            | Useful for Postman, server-to-server requests,
            | health checks, etc.
            |
            */

            if (!origin) {
                return callback(null, true);
            }

            /*
            |--------------------------------------------------------------------------
            | Check Allowed Origins
            |--------------------------------------------------------------------------
            */

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            /*
            |--------------------------------------------------------------------------
            | Block Unknown Origin
            |--------------------------------------------------------------------------
            */

            console.error("CORS BLOCKED:", origin);

            return callback(
                new Error(
                    `CORS blocked for origin: ${origin}`
                )
            );
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
        ],

        optionsSuccessStatus: 204,
    })
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
    })
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
    })
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

app.use(
    "/api/contact",
    contactRoutes
);

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

app.use(
    "/api/v1/admin/consultations",
    consultationRoutes
);

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