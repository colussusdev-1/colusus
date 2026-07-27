import express from "express";
import authenticate from "../../middleware/auth.middleware.js";




import {
    getProfile
} from "./user.controller.js";


const router = express.Router();


router.get(
    "/profile",
    authenticate,
    getProfile
);


export default router;