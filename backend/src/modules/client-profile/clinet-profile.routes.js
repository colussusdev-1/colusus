import express from "express";

import {
    createProfile,
    getProfile,
    updateProfile
} from "./client-profile.controller.js";


import authenticate from "../../middleware/auth.middleware.js";


const router = express.Router();



/*
|--------------------------------------------------------------------------
| Client Profile Routes
|--------------------------------------------------------------------------
*/


router.post(
    "/",
    authenticate,
    createProfile
);



router.get(
    "/",
    authenticate,
    getProfile
);



router.patch(
    "/",
    authenticate,
    updateProfile
);



export default router;