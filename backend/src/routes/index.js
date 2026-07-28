import express from "express";

import healthRoutes from "./health.routes.js";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";

import applicationRoutes from "../modules/applications/application.routes.js";
import documentRoutes from "../modules/documents/document.routes.js";
import clientProfileRoutes from "../modules/client-profile/clinet-profile.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import clientRoutes from "../modules/client/client.routes.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Health Routes
|--------------------------------------------------------------------------
*/

router.use("/health", healthRoutes);

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

router.use("/auth", authRoutes);

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

router.use("/users", userRoutes);

/*
|--------------------------------------------------------------------------
| Client Routes
|--------------------------------------------------------------------------
*/

router.use("/client", clientRoutes);

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

router.use("/applications", applicationRoutes);

/*
|--------------------------------------------------------------------------
| Document Routes
|--------------------------------------------------------------------------
*/

router.use("/documents", documentRoutes);

/*
|--------------------------------
|Client Profile
|-------------------------------
|
*/

router.use("/client-profile", clientProfileRoutes);

/*
Admin 
*/

router.use("/admin", adminRoutes);

export default router;
