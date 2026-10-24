import mongoose from "mongoose";

import Assessment from "./assessment.model.js";
import Opportunity from "../opportunities/opportunity.model.js";

/*
|--------------------------------------------------------------------------
| ASSESSMENT SERVICE
|--------------------------------------------------------------------------
*/

const ALLOWED_PASSPORT_STATUSES = ["YES", "NO", "IN_PROGRESS"];

const ALLOWED_DOCUMENT_TYPES = [
  "PASSPORT",
  "EDUCATIONAL_CERTIFICATE",
  "CV",
  "OTHER",
];

const ASSESSMENT_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "CONTACTED",
  "QUALIFIED",
  "NOT_QUALIFIED",
  "CONVERTED",
  "WITHDRAWN",
];

const REQUIRED_FIELDS = [
  "fullName",
  "email",
  "phone",
  "age",
  "countryOfResidence",
  "education",
  "trainingCategory",
  "preferredIntake",
  "budget",
  "hasPassport",
];

/*
|--------------------------------------------------------------------------
| EXPERIENCE VALUE MAPPING
|--------------------------------------------------------------------------
*/

const EXPERIENCE_VALUE_MAP = {
  NONE: 0,
  UNDER_1: 0.5,
  "1_2": 1,
  "3_5": 3,
  "6_PLUS": 6,
};

/*
|--------------------------------------------------------------------------
| ERROR HELPERS
|--------------------------------------------------------------------------
*/

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function createNotFoundError(message = "Assessment not found.") {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

/*
|--------------------------------------------------------------------------
| NORMALIZATION HELPERS
|--------------------------------------------------------------------------
*/

function normalizeText(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function normalizeBoolean(value) {
  return (
    value === true ||
    (typeof value === "string" && value.trim().toLowerCase() === "true")
  );
}

function normalizeStatus(value) {
  return normalizeText(value).toUpperCase();
}

/*
|--------------------------------------------------------------------------
| NORMALIZE YEARS OF EXPERIENCE
|--------------------------------------------------------------------------
*/

function normalizeYearsOfExperience(value) {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return null;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toUpperCase();

    if (
      Object.prototype.hasOwnProperty.call(
        EXPERIENCE_VALUE_MAP,
        normalizedValue,
      )
    ) {
      return EXPERIENCE_VALUE_MAP[normalizedValue];
    }

    const normalizedLabel = normalizedValue
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ");

    const labelMappings = {
      "NO EXPERIENCE": 0,
      "NO EXPERIENCE YET": 0,
      "LESS THAN 1 YEAR": 0.5,
      "UNDER 1 YEAR": 0.5,
      "1-2 YEARS": 1,
      "1 - 2 YEARS": 1,
      "3-5 YEARS": 3,
      "3 - 5 YEARS": 3,
      "6+ YEARS": 6,
      "6+ YEARS OF EXPERIENCE": 6,
      "6 OR MORE YEARS": 6,
      "6 OR MORE YEARS OF EXPERIENCE": 6,
    };

    if (Object.prototype.hasOwnProperty.call(labelMappings, normalizedLabel)) {
      return labelMappings[normalizedLabel];
    }
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 80) {
    throw createValidationError(
      "Years of experience must be between 0 and 80.",
    );
  }

  return numericValue;
}

/*
|--------------------------------------------------------------------------
| VALIDATE ASSESSMENT PAYLOAD
|--------------------------------------------------------------------------
*/

function validateAssessmentPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createValidationError("A valid assessment payload is required.");
  }

  const missingFields = REQUIRED_FIELDS.filter((field) => {
    const value = payload[field];

    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim())
    );
  });

  if (missingFields.length > 0) {
    throw createValidationError(
      `Missing required fields: ${missingFields.join(", ")}.`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EMAIL
  |--------------------------------------------------------------------------
  */

  const email = normalizeText(payload.email).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createValidationError("Please provide a valid email address.");
  }

  /*
  |--------------------------------------------------------------------------
  | AGE
  |--------------------------------------------------------------------------
  */

  const age = Number(payload.age);

  if (!Number.isInteger(age) || age < 18 || age > 100) {
    throw createValidationError(
      "Applicants must provide a valid age between 18 and 100.",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PASSPORT STATUS
  |--------------------------------------------------------------------------
  */

  const hasPassport = normalizeStatus(payload.hasPassport);

  if (!ALLOWED_PASSPORT_STATUSES.includes(hasPassport)) {
    throw createValidationError(
      "Passport status must be YES, NO, or IN_PROGRESS.",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PRIVACY CONSENT
  |--------------------------------------------------------------------------
  */

  const privacyAccepted =
    normalizeBoolean(payload.privacyAccepted) ||
    normalizeBoolean(payload.consent?.privacyAccepted) ||
    normalizeBoolean(payload.consentToContact);

  if (!privacyAccepted) {
    throw createValidationError(
      "You must accept the privacy notice before submitting.",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | YEARS OF EXPERIENCE
  |--------------------------------------------------------------------------
  */

  const yearsOfExperience = normalizeYearsOfExperience(
    payload.yearsOfExperience,
  );

  /*
  |--------------------------------------------------------------------------
  | NORMALIZED PAYLOAD
  |--------------------------------------------------------------------------
  */

  return {
    opportunityId: normalizeText(payload.opportunityId),

    fullName: normalizeText(payload.fullName),
    email,
    phone: normalizeText(payload.phone),
    age,
    countryOfResidence: normalizeText(payload.countryOfResidence),

    education: normalizeText(payload.education),
    fieldOfStudy: normalizeText(payload.fieldOfStudy),
    workExperience: normalizeText(payload.workExperience),
    yearsOfExperience,

    trainingCategory: normalizeText(payload.trainingCategory),
    preferredCourse: normalizeText(payload.preferredCourse),
    preferredIntake: normalizeText(payload.preferredIntake),
    budget: normalizeText(payload.budget),
    hasPassport,

    additionalInformation: normalizeText(payload.additionalInformation),

    privacyAccepted,
  };
}

/*
|--------------------------------------------------------------------------
| VALIDATE DOCUMENT METADATA
|--------------------------------------------------------------------------
*/

function validateAssessmentDocuments(documents = []) {
  if (!Array.isArray(documents)) {
    throw createValidationError("Documents must be supplied as a list.");
  }

  if (documents.length > 5) {
    throw createValidationError("A maximum of five documents is allowed.");
  }

  return documents.map((document) => {
    if (!document || typeof document !== "object") {
      throw createValidationError("An uploaded document is invalid.");
    }

    const documentType = normalizeStatus(document.documentType);
    const originalName = normalizeText(document.originalName);
    const mimeType = normalizeText(document.mimeType);
    const size = Number(document.size);
    const storageProvider = normalizeText(document.storageProvider);
    const storageKey = normalizeText(document.storageKey);
    const url = normalizeText(document.url);

    if (!ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
      throw createValidationError(
        `Unsupported document type: ${documentType || "unknown"}.`,
      );
    }

    if (!originalName || !mimeType || !Number.isFinite(size) || size <= 0) {
      throw createValidationError(
        "Uploaded documents must include a filename, MIME type, and valid size.",
      );
    }

    if (!storageKey && !url) {
      throw createValidationError(
        `The uploaded document "${originalName}" has no storage reference.`,
      );
    }

    return {
      documentType,
      originalName,
      mimeType,
      size,
      storageProvider,
      storageKey,
      url,
      uploadedAt: document.uploadedAt || new Date(),
    };
  });
}

/*
|--------------------------------------------------------------------------
| FORMAT PUBLIC ASSESSMENT RESPONSE
|--------------------------------------------------------------------------
*/

function formatAssessmentResponse(assessment, opportunity) {
  return {
    id: assessment._id,
    reference: assessment.reference,
    status: assessment.status,

    opportunity: {
      id: opportunity._id,
      title: opportunity.title,
      slug: opportunity.slug,
      countryName: opportunity.countryName,
    },

    personalDetails: {
      fullName: assessment.personalDetails.fullName,
      email: assessment.personalDetails.email,
      phone: assessment.personalDetails.phone,
      age: assessment.personalDetails.age,
      countryOfResidence: assessment.personalDetails.countryOfResidence,
    },

    background: {
      education: assessment.background.education,
      fieldOfStudy: assessment.background.fieldOfStudy,
      workExperience: assessment.background.workExperience,
      yearsOfExperience: assessment.background.yearsOfExperience,
    },

    preferences: {
      trainingCategory: assessment.preferences.trainingCategory,
      preferredCourse: assessment.preferences.preferredCourse,
      preferredIntake: assessment.preferences.preferredIntake,
      budget: assessment.preferences.budget,
      hasPassport: assessment.preferences.hasPassport,
    },

    additionalInformation: assessment.additionalInformation,

    documents: (assessment.documents || []).map((document) => ({
      id: document._id,
      documentType: document.documentType,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      storageProvider: document.storageProvider,
      storageKey: document.storageKey,
      url: document.url,
      uploadedAt: document.uploadedAt,
    })),

    documentCount: (assessment.documents || []).length,

    consent: {
      privacyAccepted: assessment.consent.privacyAccepted,
      acceptedAt: assessment.consent.acceptedAt,
    },

    submittedAt: assessment.submittedAt,
    createdAt: assessment.createdAt,

    nextStep: "CREATE_ACCOUNT",

    message:
      "Your eligibility assessment has been submitted successfully. Create an account or sign in to continue your journey.",
  };
}

/*
|--------------------------------------------------------------------------
| PUBLIC: SUBMIT ASSESSMENT
|--------------------------------------------------------------------------
*/

export async function submitAssessment(payload, documentMetadata = []) {
  const validated = validateAssessmentPayload(payload);

  const documents = validateAssessmentDocuments(documentMetadata);

  /*
  |--------------------------------------------------------------------------
  | OPPORTUNITY ID
  |--------------------------------------------------------------------------
  */

  if (!mongoose.isValidObjectId(validated.opportunityId)) {
    throw createValidationError(
      "A valid opportunity ID is required. Please return to the selected program and try again.",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | FIND ACTIVE OPPORTUNITY
  |--------------------------------------------------------------------------
  */

  const opportunity = await Opportunity.findOne({
    _id: validated.opportunityId,
    active: true,
  }).select("_id title slug countryName applicationFlow");

  if (!opportunity) {
    throw createNotFoundError(
      "This opportunity could not be found or is no longer available.",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VERIFY APPLICATION FLOW
  |--------------------------------------------------------------------------
  */

  if (opportunity.applicationFlow !== "ASSESSMENT_FIRST") {
    throw createValidationError(
      "This opportunity does not use the eligibility assessment process.",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE ASSESSMENT
  |--------------------------------------------------------------------------
  */

  const assessment = await Assessment.create({
    opportunity: opportunity._id,
    opportunitySlug: opportunity.slug,
    opportunityTitle: opportunity.title,
    countryName: opportunity.countryName,

    personalDetails: {
      fullName: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      age: validated.age,
      countryOfResidence: validated.countryOfResidence,
    },

    background: {
      education: validated.education,
      fieldOfStudy: validated.fieldOfStudy,
      workExperience: validated.workExperience,
      yearsOfExperience: validated.yearsOfExperience,
    },

    preferences: {
      trainingCategory: validated.trainingCategory,
      preferredCourse: validated.preferredCourse,
      preferredIntake: validated.preferredIntake,
      budget: validated.budget,
      hasPassport: validated.hasPassport,
    },

    additionalInformation: validated.additionalInformation,

    documents,

    consent: {
      privacyAccepted: validated.privacyAccepted,
      acceptedAt: new Date(),
    },

    status: "PENDING",
    submittedAt: new Date(),
  });

  return formatAssessmentResponse(assessment, opportunity);
}

/*
|--------------------------------------------------------------------------
| ADMIN: LIST ASSESSMENTS
|--------------------------------------------------------------------------
*/

export async function getAssessmentsForAdmin({
  page = 1,
  limit = 20,
  status,
  opportunityId,
  search,
} = {}) {
  const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);

  const parsedLimit = Math.min(
    100,
    Math.max(1, Number.parseInt(limit, 10) || 20),
  );

  const filter = {};

  /*
  |--------------------------------------------------------------------------
  | STATUS FILTER
  |--------------------------------------------------------------------------
  */

  if (status) {
    const normalizedStatus = normalizeStatus(status);

    if (!ASSESSMENT_STATUSES.includes(normalizedStatus)) {
      throw createValidationError("Invalid assessment status.");
    }

    filter.status = normalizedStatus;
  }

  /*
  |--------------------------------------------------------------------------
  | OPPORTUNITY FILTER
  |--------------------------------------------------------------------------
  */

  if (opportunityId) {
    if (!mongoose.isValidObjectId(opportunityId)) {
      throw createValidationError("Invalid opportunity ID.");
    }

    filter.opportunity = opportunityId;
  }

  /*
  |--------------------------------------------------------------------------
  | SEARCH FILTER
  |--------------------------------------------------------------------------
  */

  if (search && normalizeText(search)) {
    const term = normalizeText(search);
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const expression = new RegExp(escapedTerm, "i");

    filter.$or = [
      { reference: expression },
      { "personalDetails.fullName": expression },
      { "personalDetails.email": expression },
      { "personalDetails.phone": expression },
    ];
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const [assessments, total] = await Promise.all([
    Assessment.find(filter)
      .select("-internalNotes")
      .populate("opportunity", "title slug countryName")
      .populate("client")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),

    Assessment.countDocuments(filter),
  ]);

  return {
    assessments,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
}

/*
|--------------------------------------------------------------------------
| ADMIN: GET ONE ASSESSMENT
|--------------------------------------------------------------------------
*/

export async function getAssessmentForAdmin(assessmentId) {
  if (!mongoose.isValidObjectId(assessmentId)) {
    throw createValidationError("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(assessmentId)
    .select("-internalNotes")
    .populate("opportunity", "title slug countryName")
    .populate("client")
    .lean();

  if (!assessment) {
    throw createNotFoundError();
  }

  return assessment;
}

/*
|--------------------------------------------------------------------------
| ADMIN: GET ONE ASSESSMENT DOCUMENT
|--------------------------------------------------------------------------
|
| Returns the assessment and the requested document metadata.
| Actual file streaming is handled by the controller.
|
| This ensures the controller can only retrieve a document that belongs
| to the specified assessment.
|
*/

export async function getAssessmentDocumentForAdmin(assessmentId, documentId) {
  if (!mongoose.isValidObjectId(assessmentId)) {
    throw createValidationError("Invalid assessment ID.");
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw createValidationError("Invalid assessment document ID.");
  }

  const assessment = await Assessment.findById(assessmentId)
    .select("documents reference")
    .lean();

  if (!assessment) {
    throw createNotFoundError();
  }

  const document = (assessment.documents || []).find(
    (item) => String(item._id) === String(documentId),
  );

  if (!document) {
    throw createNotFoundError(
      "The requested document was not found for this assessment.",
    );
  }

  if (
    document.storageProvider !== "CLOUDINARY" ||
    !normalizeText(document.storageKey)
  ) {
    throw createNotFoundError(
      "This document does not have a valid Cloudinary storage reference.",
    );
  }

  return {
    assessmentId: String(assessment._id),
    assessmentReference: assessment.reference,
    document: {
      id: String(document._id),
      documentType: document.documentType,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      storageProvider: document.storageProvider,
      storageKey: document.storageKey,
      uploadedAt: document.uploadedAt,
    },
  };
}

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE ASSESSMENT STATUS
|--------------------------------------------------------------------------
*/

export async function updateAssessmentStatus(assessmentId, status) {
  if (!mongoose.isValidObjectId(assessmentId)) {
    throw createValidationError("Invalid assessment ID.");
  }

  const normalizedStatus = normalizeStatus(status);

  if (!ASSESSMENT_STATUSES.includes(normalizedStatus)) {
    throw createValidationError(
      `Invalid assessment status. Allowed values: ${ASSESSMENT_STATUSES.join(", ")}.`,
    );
  }

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw createNotFoundError();
  }

  const previousStatus = assessment.status;

  assessment.status = normalizedStatus;

  if (normalizedStatus !== "PENDING" && !assessment.reviewedAt) {
    assessment.reviewedAt = new Date();
  }

  if (normalizedStatus === "CONVERTED") {
    assessment.convertedAt = assessment.convertedAt || new Date();
  }

  await assessment.save();

  return {
    id: assessment._id,
    reference: assessment.reference,
    previousStatus,
    status: assessment.status,
    reviewedAt: assessment.reviewedAt,
    convertedAt: assessment.convertedAt,
  };
}

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE INTERNAL NOTES
|--------------------------------------------------------------------------
*/

export async function updateAssessmentNotes(assessmentId, internalNotes) {
  if (!mongoose.isValidObjectId(assessmentId)) {
    throw createValidationError("Invalid assessment ID.");
  }

  if (typeof internalNotes !== "string") {
    throw createValidationError("Internal notes must be a string.");
  }

  const normalizedNotes = internalNotes.trim();

  if (normalizedNotes.length > 10000) {
    throw createValidationError(
      "Internal notes cannot exceed 10,000 characters.",
    );
  }

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw createNotFoundError();
  }

  assessment.internalNotes = normalizedNotes;

  await assessment.save();

  return {
    id: assessment._id,
    reference: assessment.reference,
    internalNotes: assessment.internalNotes,
  };
}

/*
|--------------------------------------------------------------------------
| DEFAULT SERVICE EXPORT
|--------------------------------------------------------------------------
*/

const assessmentService = {
  submitAssessment,
  getAssessmentsForAdmin,
  getAssessmentForAdmin,
  getAssessmentDocumentForAdmin,
  updateAssessmentStatus,
  updateAssessmentNotes,
};

export default assessmentService;
