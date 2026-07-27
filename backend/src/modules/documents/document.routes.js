import express from "express";

import {
    createDocument,
    getDocuments,
    getApplicationDocuments,
    updateDocumentStatus
} from "./document.controller.js";


import authenticate from "../../middleware/auth.middleware.js";


const router = express.Router();



/*
|--------------------------------------------------------------------------
| Document Routes
|--------------------------------------------------------------------------
*/


router.post(
    "/",
    authenticate,
    createDocument
);



router.get(
    "/",
    authenticate,
    getDocuments
);



router.get(
    "/application/:applicationId",
    authenticate,
    getApplicationDocuments
);



router.patch(
    "/:id",
    authenticate,
    updateDocumentStatus
);



export default router;