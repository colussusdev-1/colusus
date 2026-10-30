import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/* SERVICE CONFIGURATION                                                      */
/* -------------------------------------------------------------------------- */

export const SERVICE_TYPES = Object.freeze({
  INTERNATIONAL_RECRUITMENT: "INTERNATIONAL_RECRUITMENT",
  STUDY_ABROAD: "STUDY_ABROAD",
  SKILLED_MIGRATION: "SKILLED_MIGRATION",
  TRAINEE_APPRENTICESHIP: "TRAINEE_APPRENTICESHIP",
});

export const SERVICE_NAMES = Object.freeze({
  INTERNATIONAL_RECRUITMENT: "International Recruitment",
  STUDY_ABROAD: "Study Abroad",
  SKILLED_MIGRATION: "Skilled Migration",
  TRAINEE_APPRENTICESHIP: "Trainee & Apprenticeship",
});

export const ENQUIRY_STATUSES = Object.freeze([
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "CLOSED",
]);

/* -------------------------------------------------------------------------- */
/* SERVICE REQUIRED FIELDS                                                    */
/* -------------------------------------------------------------------------- */

const requiredFields = {
  INTERNATIONAL_RECRUITMENT: [
    "industryOfInterest",
    "preferredJobRole",
    "workExperience",
    "preferredDestination",
  ],

  STUDY_ABROAD: [
    "intendedCourse",
    "preferredCountry",
    "currentEducationLevel",
    "highestQualification",
    "tuitionBudget",
    "intendedIntake",
  ],

  SKILLED_MIGRATION: [
    "currentOccupation",
    "yearsOfExperience",
    "highestQualification",
    "preferredDestination",
  ],

  TRAINEE_APPRENTICESHIP: [
    "preferredField",
    "previousWorkExperience",
    "programmeInterest",
    "preferredDestination",
    "educationBackground",
  ],
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const isValidString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

const throwValidationError = (errors) => {
  const error = new Error(errors.join(" "));
  error.statusCode = 400;
  error.validationErrors = errors;
  throw error;
};

/* -------------------------------------------------------------------------- */
/* CREATE SERVICE ENQUIRY                                                     */
/* -------------------------------------------------------------------------- */

export const createSubmission = (payload) => {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throwValidationError(["A valid enquiry payload is required."]);
  }

  const serviceType = normalizeString(payload.serviceType);

  const applicant = payload.applicant;

  const enquiryData = payload.enquiryData;

  const source = normalizeString(payload.source || "WEBSITE");

  /* SERVICE TYPE */

  if (!Object.values(SERVICE_TYPES).includes(serviceType)) {
    errors.push("Invalid service type.");
  }

  /* APPLICANT INFORMATION */

  if (!applicant || typeof applicant !== "object" || Array.isArray(applicant)) {
    errors.push("Applicant information is required.");
  } else {
    if (!isValidString(applicant.fullName)) {
      errors.push("Full name is required.");
    }

    if (
      !isValidString(applicant.email) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email.trim())
    ) {
      errors.push("A valid email address is required.");
    }

    if (!isValidString(applicant.phone)) {
      errors.push("Phone number is required.");
    }

    if (!isValidString(applicant.countryOfResidence)) {
      errors.push("Country of residence is required.");
    }
  }

  /* ENQUIRY DETAILS */

  if (
    !enquiryData ||
    typeof enquiryData !== "object" ||
    Array.isArray(enquiryData)
  ) {
    errors.push("Service enquiry details are required.");
  } else if (requiredFields[serviceType]) {
    for (const field of requiredFields[serviceType]) {
      if (!isValidString(enquiryData[field])) {
        errors.push(`${field} is required.`);
      }
    }
  }

  if (errors.length > 0) {
    throwValidationError(errors);
  }

  /* RETURN NORMALIZED DATA */

  return {
    serviceType,

    serviceName: SERVICE_NAMES[serviceType],

    applicant: {
      fullName: applicant.fullName.trim(),
      email: applicant.email.trim().toLowerCase(),
      phone: applicant.phone.trim(),
      countryOfResidence: applicant.countryOfResidence.trim(),
    },

    enquiryData: Object.fromEntries(
      Object.entries(enquiryData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    ),

    source,
  };
};

/* -------------------------------------------------------------------------- */
/* UPDATE SERVICE ENQUIRY                                                     */
/* -------------------------------------------------------------------------- */

export const updateSubmission = (payload) => {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throwValidationError(["Update payload is required."]);
  }

  const allowedFields = ["status", "assignedTo", "internalNote", "note"];

  const hasAllowedField = allowedFields.some((field) =>
    Object.prototype.hasOwnProperty.call(payload, field),
  );

  if (!hasAllowedField) {
    errors.push("No valid update fields supplied.");
  }

  let status;

  if (payload.status !== undefined) {
    status = String(payload.status).trim().toUpperCase();

    if (!ENQUIRY_STATUSES.includes(status)) {
      errors.push("Invalid enquiry status.");
    }
  }

  let assignedTo = payload.assignedTo;

  if (assignedTo !== undefined && assignedTo !== null) {
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      errors.push("Invalid assigned user ID.");
    } else {
      assignedTo = new mongoose.Types.ObjectId(assignedTo);
    }
  }

  const note = payload.note ?? payload.internalNote;

  if (note !== undefined && !isValidString(note)) {
    errors.push("Internal note cannot be empty.");
  }

  if (errors.length > 0) {
    throwValidationError(errors);
  }

  return {
    ...(status !== undefined && { status }),

    ...(assignedTo !== undefined && { assignedTo }),

    ...(note !== undefined && { note: note.trim() }),
  };
};

/* -------------------------------------------------------------------------- */
/* DEFAULT EXPORT                                                             */
/* -------------------------------------------------------------------------- */

export default {
  createSubmission,
  updateSubmission,
  SERVICE_TYPES,
  SERVICE_NAMES,
  ENQUIRY_STATUSES,
};
