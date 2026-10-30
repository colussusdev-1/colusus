import mongoose from "mongoose";
import cloudinary from "../../config/cloudinary.js";

import ServiceEnquiry from "./service-enquiry.model.js";
import serviceEnquiryValidation from "./service-enquiry.validation.js";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const CLOUDINARY_FOLDER = "colossus/service-enquiries";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_DOCUMENTS = 5;
const UPLOAD_TIMEOUT = 45000;

const SERVICE_TYPES = [
  "INTERNATIONAL_RECRUITMENT",
  "STUDY_ABROAD",
  "SKILLED_MIGRATION",
  "TRAINEE_APPRENTICESHIP",
];

const ENQUIRY_STATUSES = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "CLOSED",
];

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

/* -------------------------------------------------------------------------- */
/* ERROR HELPER                                                               */
/* -------------------------------------------------------------------------- */

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/* -------------------------------------------------------------------------- */
/* CLOUDINARY CONFIGURATION                                                   */
/* -------------------------------------------------------------------------- */

const validateCloudinaryConfiguration = () => {
  const config = cloudinary.config();

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw createError(
      "Document storage is not configured. Please contact support.",
      500,
    );
  }
};

/* -------------------------------------------------------------------------- */
/* NORMALIZE MULTER FILES                                                     */
/* -------------------------------------------------------------------------- */

const normalizeFiles = (files = []) => {
  return files.map((file) => ({
    ...file,
    fieldName: file.fieldName || file.fieldname,
  }));
};

/* -------------------------------------------------------------------------- */
/* FILE VALIDATION                                                            */
/* -------------------------------------------------------------------------- */

const validateFiles = (files = []) => {
  if (!Array.isArray(files)) {
    throw createError("Invalid document upload request.");
  }

  if (files.length > MAX_DOCUMENTS) {
    throw createError(
      `A maximum of ${MAX_DOCUMENTS} documents can be uploaded.`,
    );
  }

  for (const file of files) {
    if (!file || !Buffer.isBuffer(file.buffer)) {
      throw createError(
        `Unable to read uploaded file: ${file?.originalname || "unknown"}.`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw createError(`${file.originalname} exceeds the 10 MB file limit.`);
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw createError(`${file.originalname} has an unsupported file type.`);
    }

    if (!file.fieldName) {
      throw createError("An uploaded document has an invalid field name.");
    }
  }
};

/* -------------------------------------------------------------------------- */
/* DOCUMENT TYPE                                                              */
/* -------------------------------------------------------------------------- */

const getDocumentType = (fieldName) => {
  const types = {
    cv: "CV",
    certificates: "PROFESSIONAL_CERTIFICATE",
    licences: "PROFESSIONAL_LICENCE",
    supportingDocuments: "SUPPORTING_DOCUMENT",
  };

  return types[fieldName] || "OTHER";
};

/* -------------------------------------------------------------------------- */
/* FILENAME SANITIZATION                                                      */
/* -------------------------------------------------------------------------- */

const sanitizeFilename = (value = "service-enquiry-document") => {
  const cleaned = String(value)
    .replace(/[\\/\r\n"]/g, "_")
    .replace(/[^\w.\- ()]/g, "_")
    .trim()
    .slice(0, 180);

  return cleaned || "service-enquiry-document";
};

/* -------------------------------------------------------------------------- */
/* CLOUDINARY UPLOAD                                                          */
/* -------------------------------------------------------------------------- */

const uploadFileToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(file?.buffer)) {
      reject(createError("Invalid document buffer."));
      return;
    }

    let settled = false;

    const finish = (callback, value) => {
      if (settled) return;

      settled = true;
      clearTimeout(timeout);
      callback(value);
    };

    const timeout = setTimeout(() => {
      finish(
        reject,
        createError(
          `Upload timed out for ${file.originalname}. Please try again.`,
          504,
        ),
      );
    }, UPLOAD_TIMEOUT);

    const originalName = sanitizeFilename(file.originalname);

    let uploadStream;

    try {
      uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          resource_type: "raw",
          type: "authenticated",
          use_filename: false,
          unique_filename: true,
          overwrite: false,
          context: {
            originalName,
            documentType: getDocumentType(file.fieldName),
            serviceEnquiryDocument: "true",
          },
        },
        (error, result) => {
          if (error) {
            console.error(
              "SERVICE ENQUIRY CLOUDINARY UPLOAD FAILED:",
              error.message,
            );

            finish(reject, error);
            return;
          }

          if (!result?.public_id) {
            finish(
              reject,
              createError(
                "Cloudinary did not return a document reference.",
                502,
              ),
            );
            return;
          }

          finish(resolve, {
            fieldName: file.fieldName,
            documentType: getDocumentType(file.fieldName),
            name: file.originalname,
            publicId: result.public_id,
            resourceType: result.resource_type || "raw",
            format: result.format || "",
            mimeType: file.mimetype,
            size: file.size,
            storageType: "authenticated",
          });
        },
      );

      uploadStream.on("error", (error) => {
        finish(reject, error);
      });

      uploadStream.end(file.buffer);
    } catch (error) {
      finish(reject, error);
    }
  });
};

/* -------------------------------------------------------------------------- */
/* DELETE CLOUDINARY UPLOADS                                                  */
/* -------------------------------------------------------------------------- */

const deleteCloudinaryUploads = async (documents = []) => {
  const validDocuments = documents.filter((document) => document?.publicId);

  const results = await Promise.allSettled(
    validDocuments.map((document) =>
      cloudinary.uploader.destroy(document.publicId, {
        resource_type: document.resourceType || "raw",
        type: "authenticated",
      }),
    ),
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "SERVICE ENQUIRY DOCUMENT CLEANUP FAILED:",
        result.reason?.message || result.reason,
      );
    }
  });
};

/* -------------------------------------------------------------------------- */
/* UPLOAD MULTIPLE DOCUMENTS                                                  */
/* -------------------------------------------------------------------------- */

const uploadDocuments = async (files = []) => {
  const uploadedDocuments = [];

  try {
    for (const file of files) {
      console.log(`[Service Enquiries] Uploading: ${file.originalname}`);

      const document = await uploadFileToCloudinary(file);

      uploadedDocuments.push(document);

      console.log(`[Service Enquiries] Uploaded: ${file.originalname}`);
    }

    return uploadedDocuments;
  } catch (error) {
    await deleteCloudinaryUploads(uploadedDocuments);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* CREATE SERVICE ENQUIRY                                                     */
/* -------------------------------------------------------------------------- */

const createSubmission = async (payload, incomingFiles = []) => {
  const files = normalizeFiles(incomingFiles);

  console.log("[Service Enquiries] Validating submission...");

  validateFiles(files);

  const data = serviceEnquiryValidation.createSubmission(payload);

  let uploadedDocuments = [];

  try {
    if (files.length > 0) {
      console.log("[Service Enquiries] Checking Cloudinary config...");

      validateCloudinaryConfiguration();

      console.log(
        `[Service Enquiries] Starting ${files.length} document upload(s)...`,
      );

      uploadedDocuments = await uploadDocuments(files);
    }

    console.log("[Service Enquiries] Saving enquiry to MongoDB...");

    const submission = await ServiceEnquiry.create({
      serviceType: data.serviceType,
      serviceName: data.serviceName,
      applicant: data.applicant,
      enquiryData: data.enquiryData,
      documents: uploadedDocuments,
      source: data.source,
    });

    console.log(`[Service Enquiries] Submission saved: ${submission._id}`);

    return submission;
  } catch (error) {
    if (uploadedDocuments.length > 0) {
      await deleteCloudinaryUploads(uploadedDocuments);
    }

    console.error("[Service Enquiries] CREATE FAILED:", error.message);

    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* GET ALL SERVICE ENQUIRIES                                                  */
/* -------------------------------------------------------------------------- */

const getSubmissions = async ({
  serviceType,
  status,
  search,
  assignedTo,
  page = 1,
  limit = 25,
} = {}) => {
  const filter = {};

  if (serviceType) {
    const normalizedType = String(serviceType).trim().toUpperCase();

    if (!SERVICE_TYPES.includes(normalizedType)) {
      throw createError("Invalid service type.");
    }

    filter.serviceType = normalizedType;
  }

  if (status) {
    const normalizedStatus = String(status).trim().toUpperCase();

    if (!ENQUIRY_STATUSES.includes(normalizedStatus)) {
      throw createError("Invalid enquiry status.");
    }

    filter.status = normalizedStatus;
  }

  if (assignedTo) {
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      throw createError("Invalid assigned staff ID.");
    }

    filter.assignedTo = assignedTo;
  }

  if (search) {
    const escapedSearch = String(search)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (escapedSearch) {
      filter.$or = [
        {
          "applicant.fullName": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          "applicant.email": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          "applicant.phone": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  const [submissions, total] = await Promise.all([
    ServiceEnquiry.find(filter)
      .populate("assignedTo", "firstName lastName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    ServiceEnquiry.countDocuments(filter),
  ]);

  return {
    submissions,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages: Math.ceil(total / currentLimit),
    },
  };
};

/* -------------------------------------------------------------------------- */
/* GET SINGLE SERVICE ENQUIRY                                                 */
/* -------------------------------------------------------------------------- */

const getSubmissionById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid enquiry ID.");
  }

  const submission = await ServiceEnquiry.findById(id)
    .populate("assignedTo", "firstName lastName email role")
    .populate("internalNotes.addedBy", "firstName lastName email role");

  if (!submission) {
    throw createError("Service enquiry not found.", 404);
  }

  return submission;
};

/* -------------------------------------------------------------------------- */
/* GET SERVICE ENQUIRY DOCUMENT                                               */
/* -------------------------------------------------------------------------- */

const getDocumentFile = async ({ submissionId, documentId }) => {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw createError("Invalid enquiry ID.");
  }

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw createError("Invalid document ID.");
  }

  const submission = await ServiceEnquiry.findById(submissionId).lean();

  if (!submission) {
    throw createError("Service enquiry not found.", 404);
  }

  const document = submission.documents?.find(
    (item) => String(item._id) === String(documentId),
  );

  if (!document) {
    throw createError("Document not found.", 404);
  }

  if (document.storageType !== "authenticated" || !document.publicId) {
    throw createError(
      "This document does not have a supported private storage reference.",
      404,
    );
  }

  validateCloudinaryConfiguration();

  const cloudinaryUrl = cloudinary.utils.private_download_url(
    document.publicId,
    document.format,
    {
      resource_type: document.resourceType || "raw",
      type: "authenticated",
      attachment: false,
    },
  );

  let response;

  try {
    response = await fetch(cloudinaryUrl, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    const retrievalError = createError(
      "Unable to connect to document storage.",
      502,
    );

    retrievalError.cause = error;
    throw retrievalError;
  }

  if (!response.ok) {
    throw createError(
      `Document storage returned HTTP ${response.status}.`,
      502,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  return {
    buffer,
    contentType:
      document.mimeType ||
      response.headers.get("content-type") ||
      "application/octet-stream",
    contentLength: buffer.length,
    fileName: document.name || "service-enquiry-document",
  };
};

/* -------------------------------------------------------------------------- */
/* UPDATE SERVICE ENQUIRY                                                     */
/* -------------------------------------------------------------------------- */

const updateSubmission = async ({ id, payload, actorId }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid enquiry ID.");
  }

  const data = serviceEnquiryValidation.updateSubmission(payload);

  const submission = await ServiceEnquiry.findById(id);

  if (!submission) {
    throw createError("Service enquiry not found.", 404);
  }

  if (data.status !== undefined) {
    submission.status = data.status;
  }

  if (data.assignedTo !== undefined) {
    if (
      data.assignedTo !== null &&
      !mongoose.Types.ObjectId.isValid(data.assignedTo)
    ) {
      throw createError("Invalid assigned staff ID.");
    }

    submission.assignedTo = data.assignedTo;
  }

  const note = data.note || data.internalNote;

  if (note) {
    submission.internalNotes.push({
      message: note,
      addedBy: actorId || null,
      createdAt: new Date(),
    });
  }

  await submission.save();

  return getSubmissionById(id);
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  getDocumentFile,
  updateSubmission,
};
