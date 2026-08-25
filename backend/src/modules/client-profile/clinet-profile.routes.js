import express from "express";

import {
  createProfile,
  getProfile,
  getProfileCompletion,
  updateProfile,
} from "./client-profile.controller.js";

import authenticate from "../../middleware/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CLIENT PROFILE ROUTES
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| CREATE PROFILE
|--------------------------------------------------------------------------
|
| POST /api/v1/client-profile
|
*/

router.post("/", authenticate, createProfile);

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
|
| GET /api/v1/client-profile
|
*/

router.get("/", authenticate, getProfile);

/*
|--------------------------------------------------------------------------
| GET PROFILE COMPLETION
|--------------------------------------------------------------------------
|
| GET /api/v1/client-profile/completion
|
| Used before starting an application to determine whether
| the client must complete their profile first.
|
*/

router.get("/completion", authenticate, getProfileCompletion);

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
|
| PATCH /api/v1/client-profile
|
*/

router.patch("/", authenticate, updateProfile);

export default router;
