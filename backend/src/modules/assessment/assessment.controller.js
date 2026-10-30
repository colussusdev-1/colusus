import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

import assessmentService from "./assessment.service.js";

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const ASSESSMENT_FEE = 50000;

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_DOCUMENTS = 5;

const DOCUMENT_METADATA_KEYS = [
  "passport",
  "cv",
  "education",
  "englishTest",
  "experience",
  "additional",
];

const ALLOWED_DOCUMENT_TYPES = new Set([
  "PASSPORT",
  "EDUCATIONAL_CERTIFICATE",
  "CV",
  "OTHER",
]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/*
|--------------------------------------------------------------------------
| ERROR HELPERS
|--------------------------------------------------------------------------
*/

function createControllerError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/*
|--------------------------------------------------------------------------
| BOOLEAN NORMALIZATION
|--------------------------------------------------------------------------
*/

function normalizeBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
}

/*
|--------------------------------------------------------------------------
| CLOUDINARY CONFIGURATION
|--------------------------------------------------------------------------
*/

function validateCloudinaryConfiguration() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw createControllerError(
      "Document storage is not configured. Please contact support.",
      500,
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

/*
|--------------------------------------------------------------------------
| DOCUMENT TYPE DETECTION
|--------------------------------------------------------------------------
*/

function getDocumentType(file, metadata = {}) {
  const requestedType = String(metadata?.documentType || "").toUpperCase();

  if (ALLOWED_DOCUMENT_TYPES.has(requestedType)) {
    return requestedType;
  }

  const fieldName = String(file.fieldname || "").toUpperCase();

  const originalName = String(file.originalname || "").toUpperCase();

  if (fieldName.includes("PASSPORT") || originalName.includes("PASSPORT")) {
    return "PASSPORT";
  }

  if (
    fieldName.includes("CERTIFICATE") ||
    fieldName.includes("EDUCATION") ||
    originalName.includes("CERTIFICATE") ||
    originalName.includes("TRANSCRIPT")
  ) {
    return "EDUCATIONAL_CERTIFICATE";
  }

  if (
    fieldName.includes("CV") ||
    fieldName.includes("RESUME") ||
    originalName.includes("RESUME")
  ) {
    return "CV";
  }

  return "OTHER";
}

/*
|--------------------------------------------------------------------------
| PARSE DOCUMENT METADATA
|--------------------------------------------------------------------------
*/

function parseDocumentMetadata(req, files = []) {
  let rawMetadata = req.body?.documentMetadata;

  if (typeof rawMetadata === "string") {
    try {
      rawMetadata = JSON.parse(rawMetadata);
    } catch {
      throw createControllerError(
        "Invalid document metadata. Please refresh the form and try again.",
        400,
      );
    }
  }

  if (
    !rawMetadata ||
    typeof rawMetadata !== "object" ||
    Array.isArray(rawMetadata)
  ) {
    rawMetadata = {};
  }

  const flattened = [];

  for (const key of DOCUMENT_METADATA_KEYS) {
    const value = rawMetadata[key];

    if (key === "additional") {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === "object") {
            flattened.push(item);
          }
        }
      }

      continue;
    }

    if (value && typeof value === "object") {
      flattened.push(value);
    }
  }

  const queues = new Map();

  for (const item of flattened) {
    const name = String(item.originalName || "").trim();

    if (!name) continue;

    const queue = queues.get(name) || [];

    queue.push(item);

    queues.set(name, queue);
  }

  return files.map((file, index) => {
    const name = String(file.originalname || "").trim();

    const queue = queues.get(name);

    const matched = queue?.length ? queue.shift() : flattened[index];

    return {
      fieldKey: String(matched?.fieldKey || ""),

      documentLabel: String(matched?.documentLabel || "").trim(),

      documentType: getDocumentType(file, matched),
    };
  });
}

/*
|--------------------------------------------------------------------------
| FILE VALIDATION
|--------------------------------------------------------------------------
*/

function validateUploadedFiles(files = []) {
  if (!Array.isArray(files)) {
    throw createControllerError("Invalid document upload request.", 400);
  }

  if (files.length > MAX_DOCUMENTS) {
    throw createControllerError(
      `A maximum of ${MAX_DOCUMENTS} documents can be uploaded.`,
      400,
    );
  }

  for (const file of files) {
    if (!file || !Buffer.isBuffer(file.buffer)) {
      throw createControllerError(
        `The uploaded file "${file?.originalname || "unknown"}" could not be read.`,
        400,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw createControllerError(
        `${file.originalname} exceeds the 10 MB file limit.`,
        400,
      );
    }

    const mimeType = String(file.mimetype || "").toLowerCase();

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw createControllerError(
        `${file.originalname} has an unsupported file type.`,
        400,
      );
    }
  }
}

/*
|--------------------------------------------------------------------------
| FILE HELPERS
|--------------------------------------------------------------------------
*/

function getCloudinaryResourceType(document) {
  const mimeType = String(document?.mimeType || "").toLowerCase();

  return mimeType.startsWith("image/") ? "image" : "raw";
}

function sanitizeFilename(value = "assessment-document") {
  const cleaned = String(value)
    .replace(/[\\/\r\n"]/g, "_")
    .replace(/[^\w.\- ()]/g, "_")
    .trim()
    .slice(0, 180);

  return cleaned || "assessment-document";
}

/*
|--------------------------------------------------------------------------
| UPLOAD DOCUMENT TO CLOUDINARY
|--------------------------------------------------------------------------
*/

function uploadBufferToCloudinary(file, metadata = {}) {
  return new Promise((resolve, reject) => {
    if (!file?.buffer || !Buffer.isBuffer(file.buffer)) {
      reject(
        createControllerError(
          `Invalid uploaded file: ${file?.originalname || "unknown"}`,
          400,
        ),
      );

      return;
    }

    const mimeType = String(file.mimetype || "").toLowerCase();

    const resourceType = mimeType.startsWith("image/") ? "image" : "raw";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "colossus/assessments",

        resource_type: resourceType,

        type: "authenticated",

        use_filename: false,

        unique_filename: true,

        context: {
          originalName: sanitizeFilename(file.originalname),

          documentType: getDocumentType(file, metadata),

          documentLabel: sanitizeFilename(metadata.documentLabel || ""),
        },
      },

      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.public_id) {
          reject(new Error("Cloudinary did not return a file reference."));
          return;
        }

        resolve({
          documentType: getDocumentType(file, metadata),

          documentLabel: String(metadata.documentLabel || "").trim(),

          fieldKey: String(metadata.fieldKey || "").trim(),

          originalName: file.originalname,

          mimeType: file.mimetype,

          size: file.size,

          storageProvider: "CLOUDINARY",

          storageKey: result.public_id,

          url: "",

          uploadedAt: new Date(),
        });
      },
    );

    uploadStream.on("error", reject);

    uploadStream.end(file.buffer);
  });
}

/*
|--------------------------------------------------------------------------
| DELETE CLOUDINARY UPLOADS
|--------------------------------------------------------------------------
*/

async function deleteCloudinaryUploads(documents = []) {
  const cloudinaryDocuments = documents.filter(
    (document) =>
      document?.storageProvider === "CLOUDINARY" && document?.storageKey,
  );

  const results = await Promise.allSettled(
    cloudinaryDocuments.map((document) =>
      cloudinary.uploader.destroy(document.storageKey, {
        resource_type: getCloudinaryResourceType(document),

        type: "authenticated",
      }),
    ),
  );

  for (const result of results) {
    if (result.status === "rejected") {
      console.error(
        "Assessment document cleanup failed:",
        result.reason?.message || result.reason,
      );
    }
  }
}

/*
|--------------------------------------------------------------------------
| UPLOAD ASSESSMENT DOCUMENTS
|--------------------------------------------------------------------------
*/

async function uploadAssessmentDocuments(files = [], documentMetadata = []) {
  const uploadedDocuments = [];

  try {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];

      const metadata = documentMetadata[index] || {};

      const document = await uploadBufferToCloudinary(file, metadata);

      uploadedDocuments.push(document);
    }

    return uploadedDocuments;
  } catch (error) {
    await deleteCloudinaryUploads(uploadedDocuments);

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| PARSE ASSESSMENT PAYLOAD
|--------------------------------------------------------------------------
*/

function parseAssessmentPayload(req) {
  let rawAssessment = req.body?.assessment;

  if (typeof rawAssessment === "string") {
    try {
      rawAssessment = JSON.parse(rawAssessment);
    } catch {
      throw createControllerError(
        "Invalid assessment JSON. Please refresh and try again.",
        400,
      );
    }
  }

  if (
    !rawAssessment ||
    typeof rawAssessment !== "object" ||
    Array.isArray(rawAssessment)
  ) {
    rawAssessment = req.body || {};
  }

  const personalDetails = rawAssessment.personalDetails || {};

  const background = rawAssessment.background || {};

  const preferences = rawAssessment.preferences || {};

  const originalConsent = rawAssessment.consent || {};

  const passportStatusMap = {
    VALID: "YES",
    EXPIRED: "YES",
    PROCESSING: "IN_PROGRESS",
    NONE: "NO",
  };

  const passportValue =
    rawAssessment.hasPassport ??
    preferences.hasPassport ??
    rawAssessment.passportStatus ??
    "";

  const normalizedPassport =
    passportStatusMap[String(passportValue).toUpperCase()] ||
    String(passportValue).toUpperCase();

  /*
   * IMPORTANT:
   * Multipart form data can deliver Boolean values as strings.
   * Normalize all supported consent fields before validation.
   */

  const privacyAccepted =
    normalizeBoolean(originalConsent.privacyAccepted) ||
    normalizeBoolean(rawAssessment.privacyAccepted) ||
    normalizeBoolean(rawAssessment.consentToContact);

  const fullName =
    rawAssessment.fullName ||
    personalDetails.fullName ||
    [rawAssessment.firstName, rawAssessment.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

  const email = String(rawAssessment.email || personalDetails.email || "")
    .trim()
    .toLowerCase();

  return {
    ...rawAssessment,

    fullName,

    email,

    phone: rawAssessment.phone || personalDetails.phone || "",

    age: rawAssessment.age ?? personalDetails.age ?? null,

    countryOfResidence:
      rawAssessment.countryOfResidence ||
      personalDetails.countryOfResidence ||
      "",

    education: rawAssessment.education || background.education || "",

    fieldOfStudy: rawAssessment.fieldOfStudy || background.fieldOfStudy || "",

    workExperience:
      rawAssessment.workExperience || background.workExperience || "",

    yearsOfExperience:
      rawAssessment.yearsOfExperience ?? background.yearsOfExperience ?? "",

    trainingCategory:
      rawAssessment.trainingCategory || preferences.trainingCategory || "",

    preferredCourse:
      rawAssessment.preferredCourse || preferences.preferredCourse || "",

    preferredIntake:
      rawAssessment.preferredIntake || preferences.preferredIntake || "",

    budget: rawAssessment.budget ?? preferences.budget ?? "",

    hasPassport: normalizedPassport || "NO",

    additionalInformation: rawAssessment.additionalInformation || "",

    privacyAccepted,

    consent: {
      ...originalConsent,
      privacyAccepted,
    },
  };
}

/*
|--------------------------------------------------------------------------
| CLIENT: CREATE ASSESSMENT
|--------------------------------------------------------------------------
|
| Assessment is saved as PENDING_PAYMENT.
| It is NOT officially submitted until Paystack verifies payment.
|
*/

export async function submitAssessment(req, res, next) {
  let uploadedDocuments = [];

  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      throw createControllerError(
        "Authentication is required to submit an assessment.",
        401,
      );
    }

    const files = Array.isArray(req.files) ? req.files : [];

    validateUploadedFiles(files);

    const payload = parseAssessmentPayload(req);

    const documentMetadata = parseDocumentMetadata(req, files);

    if (!payload.fullName || !payload.email) {
      throw createControllerError(
        "Your full name and email address are required.",
        400,
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      throw createControllerError("Please provide a valid email address.", 400);
    }

    if (!payload.opportunityId) {
      throw createControllerError(
        "Please select a trainee or apprenticeship programme.",
        400,
      );
    }

    if (!payload.privacyAccepted) {
      throw createControllerError(
        "Consent is required before submitting your assessment.",
        400,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | UPLOAD DOCUMENTS
    |--------------------------------------------------------------------------
    */

    if (files.length > 0) {
      validateCloudinaryConfiguration();

      uploadedDocuments = await uploadAssessmentDocuments(
        files,
        documentMetadata,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE ASSESSMENT
    |--------------------------------------------------------------------------
    */

    const result = await assessmentService.submitAssessment(
      payload,
      uploadedDocuments,
      userId,
    );

    return res.status(201).json({
      success: true,

      message: result?.message,

      data: {
        ...result,

        paymentRequired: true,

        paymentDetails: {
          amount: ASSESSMENT_FEE,

          currency: "NGN",

          description: "Trainee Program Assessment Fee",
        },

        nextStep: "INITIALIZE_PAYMENT",
      },
    });
  } catch (error) {
    if (uploadedDocuments.length > 0) {
      await deleteCloudinaryUploads(uploadedDocuments);
    }

    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| CLIENT: GET MY ASSESSMENTS
|--------------------------------------------------------------------------
*/

export async function getMyAssessments(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      throw createControllerError("Authentication is required.", 401);
    }

    const result = await assessmentService.getMyAssessments(userId, {
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,

      data: result.assessments,

      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| CLIENT: GET MY ASSESSMENT
|--------------------------------------------------------------------------
*/

export async function getMyAssessment(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      throw createControllerError("Authentication is required.", 401);
    }

    const assessment = await assessmentService.getMyAssessment(
      userId,
      req.params.id,
    );

    return res.status(200).json({
      success: true,

      data: assessment,
    });
  } catch (error) {
    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN: LIST ASSESSMENTS
|--------------------------------------------------------------------------
*/

export async function getAssessmentsForAdmin(req, res, next) {
  try {
    const result = await assessmentService.getAssessmentsForAdmin({
      page: req.query.page,

      limit: req.query.limit,

      status: req.query.status,

      submissionStatus: req.query.submissionStatus,

      paymentStatus: req.query.paymentStatus,

      opportunityId: req.query.opportunityId,

      search: req.query.search,
    });

    return res.status(200).json({
      success: true,

      data: result.assessments,

      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN: GET ASSESSMENT
|--------------------------------------------------------------------------
*/

export async function getAssessmentForAdmin(req, res, next) {
  try {
    const assessment = await assessmentService.getAssessmentForAdmin(
      req.params.id,
    );

    return res.status(200).json({
      success: true,

      data: assessment,
    });
  } catch (error) {
    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN: ACCESS PRIVATE DOCUMENT
|--------------------------------------------------------------------------
*/

export async function accessAssessmentDocument(req, res, next) {
  let upstream;

  try {
    validateCloudinaryConfiguration();

    const { id: assessmentId, documentId } = req.params;

    const result = await assessmentService.getAssessmentDocumentForAdmin(
      assessmentId,
      documentId,
    );

    const document = result?.document;

    if (
      !document ||
      String(document.storageProvider || "").toUpperCase() !== "CLOUDINARY" ||
      !document.storageKey
    ) {
      throw createControllerError(
        "This document does not have a supported private storage reference.",
        404,
      );
    }

    const isDownload = ["1", "true", "yes"].includes(
      String(req.query.download || "").toLowerCase(),
    );

    const filename = sanitizeFilename(document.originalName);

    const resourceType = getCloudinaryResourceType(document);

    const privateUrl = cloudinary.url(document.storageKey, {
      resource_type: resourceType,

      type: "authenticated",

      sign_url: true,

      secure: true,
    });

    upstream = await fetch(privateUrl, {
      method: "GET",

      redirect: "follow",

      signal: AbortSignal.timeout(30000),
    });

    if (!upstream.ok || !upstream.body) {
      console.error("Cloudinary document retrieval failed:", {
        assessmentId,
        documentId,
        status: upstream.status,
      });

      throw createControllerError(
        "Unable to retrieve this private document from storage. Check the Cloudinary delivery configuration.",
        upstream.status === 404 ? 404 : 502,
      );
    }

    const contentType =
      document.mimeType ||
      upstream.headers.get("content-type") ||
      "application/octet-stream";

    const disposition = isDownload ? "attachment" : "inline";

    const encodedFilename = encodeURIComponent(
      document.originalName || filename,
    );

    res.setHeader("Content-Type", contentType);

    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
    );

    res.setHeader("Cache-Control", "private, no-store, max-age=0");

    res.setHeader("Pragma", "no-cache");

    res.setHeader("X-Content-Type-Options", "nosniff");

    const contentLength = upstream.headers.get("content-length");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    const documentStream = Readable.fromWeb(upstream.body);

    documentStream.on("error", (error) => {
      console.error("Assessment document stream failed:", error.message);

      if (!res.headersSent) {
        res.status(502).end("Unable to stream document.");
      } else {
        res.destroy(error);
      }
    });

    documentStream.pipe(res);
  } catch (error) {
    if (upstream?.body) {
      try {
        await upstream.body.cancel();
      } catch {
        // Response stream may already be consumed.
      }
    }

    if (res.headersSent) {
      return res.destroy(error);
    }

    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE ASSESSMENT STATUS
|--------------------------------------------------------------------------
*/

export async function updateAssessmentStatus(req, res, next) {
  try {
    const { status } = req.body || {};

    if (!status) {
      throw createControllerError("An assessment status is required.", 400);
    }

    const assessment = await assessmentService.updateAssessmentStatus(
      req.params.id,
      status,
    );

    return res.status(200).json({
      success: true,

      message: "Assessment status updated successfully.",

      data: assessment,
    });
  } catch (error) {
    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE INTERNAL NOTES
|--------------------------------------------------------------------------
*/

export async function updateAssessmentNotes(req, res, next) {
  try {
    const { internalNotes } = req.body || {};

    const assessment = await assessmentService.updateAssessmentNotes(
      req.params.id,
      internalNotes,
    );

    return res.status(200).json({
      success: true,

      message: "Internal notes saved successfully.",

      data: assessment,
    });
  } catch (error) {
    return next(error);
  }
}

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

const assessmentController = {
  submitAssessment,

  getMyAssessments,

  getMyAssessment,

  getAssessmentsForAdmin,

  getAssessmentForAdmin,

  accessAssessmentDocument,

  updateAssessmentStatus,

  updateAssessmentNotes,
};

export default assessmentController;
