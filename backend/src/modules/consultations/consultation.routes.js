import express from "express";

import consultationController from "./consultation.controller.js";

import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Authentication
|--------------------------------------------------------------------------
*/

router.use(authenticate);

router.use(authorize("ADMIN"));

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/

router.get("/", consultationController.getAllConsultations);

/*
|--------------------------------------------------------------------------
| Get Consultation By ID
|--------------------------------------------------------------------------
*/

router.get("/:id", consultationController.getConsultationById);

export default router;
