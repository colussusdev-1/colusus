import multer from "multer";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const MAX_DOCUMENTS = 5;

/* -------------------------------------------------------------------------- */
/* MEMORY STORAGE                                                             */
/* -------------------------------------------------------------------------- */

const storage = multer.memoryStorage();

/* -------------------------------------------------------------------------- */
/* ALLOWED FILE TYPES                                                         */
/* -------------------------------------------------------------------------- */

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

/* -------------------------------------------------------------------------- */
/* FILE FILTER                                                                */
/* -------------------------------------------------------------------------- */

const fileFilter = (req, file, callback) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const error = new Error("Only PDF, JPG and PNG documents are allowed.");

    error.statusCode = 400;

    return callback(error);
  }

  callback(null, true);
};

/* -------------------------------------------------------------------------- */
/* MULTER CONFIGURATION                                                       */
/* -------------------------------------------------------------------------- */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_DOCUMENTS,
    fields: 10,
    fieldSize: 100 * 1024,
  },
});

/* -------------------------------------------------------------------------- */
/* SERVICE ENQUIRY FILE FIELDS                                                */
/* -------------------------------------------------------------------------- */

const serviceEnquiryUpload = upload.fields([
  {
    name: "cv",
    maxCount: 1,
  },
  {
    name: "certificates",
    maxCount: 3,
  },
  {
    name: "licences",
    maxCount: 2,
  },
  {
    name: "supportingDocuments",
    maxCount: 5,
  },
]);

/* -------------------------------------------------------------------------- */
/* FILE NORMALIZER                                                            */
/* -------------------------------------------------------------------------- */

export const getServiceEnquiryFiles = (files = {}) => {
  const normalized = [];

  const allowedFields = [
    "cv",
    "certificates",
    "licences",
    "supportingDocuments",
  ];

  for (const fieldName of allowedFields) {
    const fieldFiles = files[fieldName] || [];

    for (const file of fieldFiles) {
      normalized.push({
        ...file,
        fieldName,
      });
    }
  }

  if (normalized.length > MAX_DOCUMENTS) {
    const error = new Error(
      `A maximum of ${MAX_DOCUMENTS} documents can be uploaded.`,
    );

    error.statusCode = 400;

    throw error;
  }

  return normalized;
};

export default serviceEnquiryUpload;
