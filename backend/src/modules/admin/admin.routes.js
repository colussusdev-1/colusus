import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
    getDashboardStats,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus
} from "./admin.controller.js";


const router = express.Router();



/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

router.get(

    "/dashboard",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    getDashboardStats

);





/*
|--------------------------------------------------------------------------
| Admin Application Management
|--------------------------------------------------------------------------
*/


router.get(

    "/applications",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    getAllApplications

);



router.get(

    "/applications/:id",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    getApplicationById

);



router.patch(

    "/applications/:id/status",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    updateApplicationStatus

);



export default router;