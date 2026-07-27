import express from "express";


import {

    createApplication,

    getApplications,

    getApplication

} from "./application.controller.js";


import authenticate from "../../middleware/auth.middleware.js";



const router = express.Router();



router.post(

    "/",

    authenticate,

    createApplication

);



router.get(

    "/",

    authenticate,

    getApplications

);



router.get(

    "/:id",

    authenticate,

    getApplication

);



export default router;