import clientProfileService from "./client-profile.service.js";

/*
============================================================
CREATE PROFILE
============================================================
*/

export const createProfile = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    CHECK FOR EXISTING PROFILE
    ----------------------------------------------------------
    */

    const existingProfile = await clientProfileService.getProfileByUserId(
      req.user.id,
    );

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    /*
    ----------------------------------------------------------
    CREATE PROFILE
    ----------------------------------------------------------
    */

    const profile = await clientProfileService.createProfile({
      user: req.user.id,

      ...req.body,
    });

    return res.status(201).json({
      success: true,

      message: "Client profile created successfully",

      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET PROFILE
============================================================

If the client does not have a profile yet, an empty profile
is created automatically.

This allows newly registered clients to enter the profile
completion flow without receiving a 404.

============================================================
*/

export const getProfile = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    FIND EXISTING PROFILE
    ----------------------------------------------------------
    */

    let profile = await clientProfileService.getProfileByUserId(req.user.id);

    /*
    ----------------------------------------------------------
    CREATE EMPTY PROFILE FOR NEW CLIENT
    ----------------------------------------------------------
    */

    if (!profile) {
      profile = await clientProfileService.createProfile({
        user: req.user.id,
      });
    }

    /*
    ----------------------------------------------------------
    SUCCESS
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET PROFILE COMPLETION
============================================================
*/

export const getProfileCompletion = async (req, res, next) => {
  try {
    const completion = await clientProfileService.getProfileCompletion(
      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: completion,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE PROFILE
============================================================
*/

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await clientProfileService.updateProfile(
      req.user.id,

      req.body,
    );

    /*
    ----------------------------------------------------------
    PROFILE NOT FOUND
    ----------------------------------------------------------
    */

    if (!profile) {
      return res.status(404).json({
        success: false,

        message: "Client profile not found",
      });
    }

    /*
    ----------------------------------------------------------
    SUCCESS
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: "Profile updated successfully",

      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
