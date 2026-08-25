import ClientProfile from "./client-profile.model.js";

/*
============================================================
REQUIRED PROFILE FIELDS
============================================================

These fields must be completed before the client can
continue with their migration application.

The client's name and email live on the User model.

============================================================
*/

const REQUIRED_PROFILE_FIELDS = [
  "phoneNumber",
  "dateOfBirth",
  "nationality",
  "currentCountry",
  "address",
  "passportNumber",
  "migrationGoal"
];

/*
============================================================
CREATE PROFILE
============================================================
*/

const createProfile = async (data) => {
  const profile = await ClientProfile.create(data);

  return profile;
};

/*
============================================================
GET PROFILE BY USER ID
============================================================

Returns the ClientProfile together with the authenticated
User's basic account information.

We populate only the fields the client portal needs.

============================================================
*/

const getProfileByUserId = async (userId) => {
  const profile = await ClientProfile.findOne({
    user: userId,
  }).populate("user", "name email role");

  return profile;
};

/*
============================================================
UPDATE PROFILE
============================================================
*/

const updateProfile = async (userId, data) => {
  const profile = await ClientProfile.findOneAndUpdate(
    {
      user: userId,
    },

    data,

    {
      new: true,
      runValidators: true,
    },
  ).populate("user", "name email role");

  return profile;
};

/*
============================================================
CHECK FIELD VALUE
============================================================
*/

const isFieldEmpty = (field, value) => {
  /*
  ----------------------------------------------------------
  NULL / UNDEFINED
  ----------------------------------------------------------
  */

  if (value === undefined || value === null) {
    return true;
  }

  /*
  ----------------------------------------------------------
  STRING VALUES
  ----------------------------------------------------------
  */

  if (typeof value === "string") {
    return value.trim() === "";
  }

  /*
  ----------------------------------------------------------
  DATE OF BIRTH
  ----------------------------------------------------------
  */

  if (field === "dateOfBirth") {
    if (!(value instanceof Date)) {
      return true;
    }

    if (Number.isNaN(value.getTime())) {
      return true;
    }
  }

  return false;
};

/*
============================================================
GET PROFILE COMPLETION
============================================================

Returns:

{
  exists: true,
  isComplete: false,
  percentage: 75,
  missingFields: [...]
}

This is used by the client portal and application flow
to determine whether the client has completed their profile.

============================================================
*/

const getProfileCompletion = async (userId) => {
  /*
  ----------------------------------------------------------
  FIND PROFILE
  ----------------------------------------------------------
  */

  const profile = await ClientProfile.findOne({
    user: userId,
  }).lean();

  /*
  ----------------------------------------------------------
  PROFILE DOES NOT EXIST
  ----------------------------------------------------------
  */

  if (!profile) {
    return {
      exists: false,

      isComplete: false,

      percentage: 0,

      missingFields: [...REQUIRED_PROFILE_FIELDS],
    };
  }

  /*
  ----------------------------------------------------------
  FIND MISSING FIELDS
  ----------------------------------------------------------
  */

  const missingFields = REQUIRED_PROFILE_FIELDS.filter((field) =>
    isFieldEmpty(field, profile[field]),
  );

  /*
  ----------------------------------------------------------
  COMPLETION CALCULATION
  ----------------------------------------------------------
  */

  const totalFields = REQUIRED_PROFILE_FIELDS.length;

  const completedFields = totalFields - missingFields.length;

  const percentage = Math.round((completedFields / totalFields) * 100);

  const isComplete = missingFields.length === 0;

  /*
  ----------------------------------------------------------
  RETURN
  ----------------------------------------------------------
  */

  return {
    exists: true,

    isComplete,

    percentage,

    missingFields,
  };
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  createProfile,

  getProfileByUserId,

  updateProfile,

  getProfileCompletion,
};
