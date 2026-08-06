import express from "express";

import contactController from "./contact.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Contact Form
|--------------------------------------------------------------------------
*/

router.post("/", contactController.sendMessage);

export default router;
