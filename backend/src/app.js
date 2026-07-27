import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

import apiRoutes from "./routes/index.js";

const app = express();


/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));



/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/





/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Future routes will enter here:
|
| /api/v1/auth
| /api/v1/users
| /api/v1/applications
| /api/v1/documents
|
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
|
| IMPORTANT:
| These must always be the last middleware.
|
|--------------------------------------------------------------------------
*/
app.use("/api/v1", apiRoutes);

app.use(notFound);

app.use(errorHandler);



export default app;