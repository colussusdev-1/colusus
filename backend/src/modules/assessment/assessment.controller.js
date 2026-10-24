import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

import assessmentService from "./assessment.service.js";

/*
|--------------------------------------------------------------------------
| CLOUDINARY CONFIGURATION
|--------------------------------------------------------------------------
*/

function validateCloudinaryConfiguration() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const error = new Error(
      "Document storage is not configured. Please contact support.",
    );

    error.statusCode = 500;
    throw error;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

/*
|--------------------------------------------------------------------------
| DOCUMENT HELPERS
|--------------------------------------------------------------------------
*/

function getDocumentType(file) {
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
| CLOUDINARY RESOURCE TYPE
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Uploads are stored as:
| - image/* -> image
| - everything else -> raw
|
| Retrieval and deletion must use the same resource type.
|
*/

function getCloudinaryResourceType(document) {
  const mimeType = String(document?.mimeType || "").toLowerCase();

  return mimeType.startsWith("image/") ? "image" : "raw";
}

/*
|--------------------------------------------------------------------------
| FILENAME SANITIZATION
|--------------------------------------------------------------------------
*/

function sanitizeFilename(value = "assessment-document") {
  const cleaned = String(value)
    .replace(/[\\/\r\n"]/g, "_")
    .replace(/[^\w.\- ()]/g, "_")
    .trim()
    .slice(0, 180);

  return cleaned || "assessment-document";
}

function createControllerError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/*
|--------------------------------------------------------------------------
| UPLOAD BUFFER TO CLOUDINARY
|--------------------------------------------------------------------------
*/

function uploadBufferToCloudinary(file) {
  return new Promise((resolve, reject) => {
    if (!file?.buffer || !Buffer.isBuffer(file.buffer)) {
      reject(
        new Error(`Invalid uploaded file: ${file?.originalname || "unknown"}`),
      );

      return;
    }

    const isImage = String(file.mimetype || "")
      .toLowerCase()
      .startsWith("image/");

    const resourceType = isImage ? "image" : "raw";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "colossus/assessments",
        resource_type: resourceType,
        type: "authenticated",
        use_filename: false,
        unique_filename: true,
        context: {
          originalName: file.originalname,
          documentType: getDocumentType(file),
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
          documentType: getDocumentType(file),
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
  const results = await Promise.allSettled(
    documents
      .filter(
        (document) =>
          document.storageProvider === "CLOUDINARY" && document.storageKey,
      )
      .map((document) =>
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
| UPLOAD ALL ASSESSMENT DOCUMENTS
|--------------------------------------------------------------------------
*/

async function uploadAssessmentDocuments(files = []) {
  const uploadedDocuments = [];

  try {
    for (const file of files) {
      const document = await uploadBufferToCloudinary(file);
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
| SECURE PRIVATE DOCUMENT DELIVERY
|--------------------------------------------------------------------------
|
| GET /api/v1/assessments/admin/:id/documents/:documentId
|
| Inline viewing:
| GET /api/v1/assessments/admin/:id/documents/:documentId
|
| Download:
| GET /api/v1/assessments/admin/:id/documents/:documentId?download=1
|
| The route must use authentication and admin role middleware.
|
*/

export async function accessAssessmentDocument(req, res, next) {
  let upstream;

  try {
    validateCloudinaryConfiguration();

    const { id: assessmentId, documentId } = req.params;

    /*
    |--------------------------------------------------------------------------
    | FIND THE DOCUMENT THROUGH THE SERVICE
    |--------------------------------------------------------------------------
    |
    | The service validates both IDs and ensures the document belongs
    | to the specified assessment.
    |
    */

    const result = await assessmentService.getAssessmentDocumentForAdmin(
      assessmentId,
      documentId,
    );

    const document = result.document;

    if (
      String(document.storageProvider || "").toUpperCase() !== "CLOUDINARY" ||
      !document.storageKey
    ) {
      throw createControllerError(
        "This document does not have a supported private storage reference.",
        404,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | DETERMINE DELIVERY MODE
    |--------------------------------------------------------------------------
    */

    const isDownload = ["1", "true", "yes"].includes(
      String(req.query.download || "").toLowerCase(),
    );

    const filename = sanitizeFilename(document.originalName);
    const resourceType = getCloudinaryResourceType(document);

    /*
    |--------------------------------------------------------------------------
    | GENERATE AUTHENTICATED CLOUDINARY URL
    |--------------------------------------------------------------------------
    |
    | This URL is used server-side only. It is never included in the
    | JSON response to the frontend.
    |
    */

    const privateUrl = cloudinary.url(document.storageKey, {
      resource_type: resourceType,
      type: "authenticated",
      sign_url: true,
      secure: true,
    });

    /*
    |--------------------------------------------------------------------------
    | RETRIEVE THE PRIVATE FILE
    |--------------------------------------------------------------------------
    */

    upstream = await fetch(privateUrl, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
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

    /*
    |--------------------------------------------------------------------------
    | RESPONSE HEADERS
    |--------------------------------------------------------------------------
    */

    const contentType =
      document.mimeType ||
      upstream.headers.get("content-type") ||
      "application/octet-stream";

    const disposition = isDownload ? "attachment" : "inline";

    res.setHeader("Content-Type", contentType);

    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(document.originalName || filename)}`,
    );

    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("X-Content-Type-Options", "nosniff");

    const contentLength = upstream.headers.get("content-length");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    /*
    |--------------------------------------------------------------------------
    | STREAM FILE TO THE AUTHENTICATED CLIENT
    |--------------------------------------------------------------------------
    */

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
        // The upstream body may already be consumed or closed.
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
| PARSE AND NORMALIZE ASSESSMENT PAYLOAD
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

  const privacyAccepted =
    originalConsent.privacyAccepted === true ||
    rawAssessment.privacyAccepted === true ||
    rawAssessment.consentToContact === true;

  return {
    ...rawAssessment,

    fullName:
      rawAssessment.fullName ||
      personalDetails.fullName ||
      [rawAssessment.firstName, rawAssessment.lastName]
        .filter(Boolean)
        .join(" ")
        .trim(),

    email: rawAssessment.email || personalDetails.email || "",

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
| PUBLIC: SUBMIT ASSESSMENT
|--------------------------------------------------------------------------
|
| POST /api/v1/assessments
|
*/

export async function submitAssessment(req, res, next) {
  let uploadedDocuments = [];

  try {
    const files = Array.isArray(req.files) ? req.files : [];

    if (files.length > 5) {
      throw createControllerError(
        "A maximum of five documents can be uploaded.",
        400,
      );
    }

    const payload = parseAssessmentPayload(req);

    console.info("Assessment submission received:", {
      hasAssessmentField: Boolean(req.body?.assessment),
      fileCount: files.length,
      hasFullName: Boolean(payload.fullName),
      hasEmail: Boolean(payload.email),
      hasPhone: Boolean(payload.phone),
      hasAge: payload.age != null,
      hasCountryOfResidence: Boolean(payload.countryOfResidence),
      hasEducation: Boolean(payload.education),
      hasTrainingCategory: Boolean(payload.trainingCategory),
      hasPreferredIntake: Boolean(payload.preferredIntake),
      hasBudget: Boolean(payload.budget),
      hasPassport: Boolean(payload.hasPassport),
      privacyAccepted: payload.privacyAccepted,
      nestedPrivacyAccepted: payload.consent.privacyAccepted,
    });

    if (files.length > 0) {
      validateCloudinaryConfiguration();
      uploadedDocuments = await uploadAssessmentDocuments(files);
    }

    const result = await assessmentService.submitAssessment(
      payload,
      uploadedDocuments,
    );

    return res.status(201).json({
      success: true,
      message: result?.message || "Assessment submitted successfully.",
      data: result,
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
| ADMIN: LIST ASSESSMENTS
|--------------------------------------------------------------------------
*/

export async function getAssessmentsForAdmin(req, res, next) {
  try {
    const result = await assessmentService.getAssessmentsForAdmin({
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
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
| ADMIN: GET ASSESSMENT DETAILS
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
| ADMIN: UPDATE ASSESSMENT STATUS
|--------------------------------------------------------------------------
*/

export async function updateAssessmentStatus(req, res, next) {
  try {
    const { status } = req.body || {};

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
| DEFAULT CONTROLLER EXPORT
|--------------------------------------------------------------------------
*/

const assessmentController = {
  submitAssessment,
  getAssessmentsForAdmin,
  getAssessmentForAdmin,
  accessAssessmentDocument,
  updateAssessmentStatus,
  updateAssessmentNotes,
};

export default assessmentController;
