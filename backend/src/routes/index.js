import express from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import applicationRoutes from "./application.routes.js";
import documentRoutes from "./document.routes.js";


const router = express.Router();


router.use("/health", healthRoutes);

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/applications", applicationRoutes);

router.use("/documents", documentRoutes);


export default router;