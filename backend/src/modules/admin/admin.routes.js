import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
    getDashboardStats,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus
} from "./admin.controller.js";


import {
    getAllDocuments,
    getDocumentById,
    updateDocumentStatus
} from "./admin.document.controller.js";



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


// Get all applications

router.get(

    "/applications",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    getAllApplications

);




// Get single application

router.get(

    "/applications/:id",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    getApplicationById

);




// Update application status

router.patch(

    "/applications/:id/status",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    updateApplicationStatus

);






/*
|--------------------------------------------------------------------------
| Admin Document Management
|--------------------------------------------------------------------------
*/


// Get all documents

router.get(

    "/documents",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    getAllDocuments

);




// Get single document

router.get(

    "/documents/:id",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    getDocumentById

);




// Update document status

router.patch(

    "/documents/:id/status",

    authenticate,

    allowRoles("ADMIN", "STAFF"),

    updateDocumentStatus

);





export default router;