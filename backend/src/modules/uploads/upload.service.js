import cloudinary from "../../config/cloudinary.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const IMAGE_TYPES = new Set([
  "IMAGE",
  "OPPORTUNITY_IMAGE",
  "DESTINATION_IMAGE",
]);

const ALLOWED_IMAGE_MIMETYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_DOCUMENT_MIMETYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeType = (type) =>
  String(type || "DOCUMENT")
    .trim()
    .toUpperCase();

/* -------------------------------------------------------------------------- */
/* CLOUDINARY UPLOAD                                                          */
/* -------------------------------------------------------------------------- */

const uploadBufferToCloudinary = ({
  buffer,
  originalName,
  mimetype,
  folder = "colossus/documents",
  resourceType = "raw",
}) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return Promise.reject(createError("A valid file buffer is required."));
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        type: "upload",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result?.secure_url || !result?.public_id) {
          return reject(
            createError("Cloudinary did not return a valid uploaded file."),
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          originalName,
          mimetype,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.on("error", reject);
    uploadStream.end(buffer);
  });
};

/* -------------------------------------------------------------------------- */
/* UPLOAD FILE                                                                */
/* -------------------------------------------------------------------------- */

const uploadFile = async ({ file, type = "DOCUMENT" }) => {
  if (!file) {
    throw createError("No file was provided.");
  }

  const normalizedType = normalizeType(type);
  const isImage = IMAGE_TYPES.has(normalizedType);

  /* ------------------------------------------------------------------------ */
  /* VALIDATE MIME TYPE                                                       */
  /* ------------------------------------------------------------------------ */

  if (isImage && !ALLOWED_IMAGE_MIMETYPES.has(file.mimetype)) {
    throw createError("Images must be JPEG, PNG, or WebP files.");
  }

  if (!isImage && !ALLOWED_DOCUMENT_MIMETYPES.has(file.mimetype)) {
    throw createError("Only PDF, JPG and PNG documents are allowed.");
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE FILE SIZE                                                       */
  /* ------------------------------------------------------------------------ */

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  if (file.size > MAX_FILE_SIZE) {
    throw createError("The file must not exceed 10MB.");
  }

  /* ------------------------------------------------------------------------ */
  /* UPLOAD TO CLOUDINARY                                                     */
  /* ------------------------------------------------------------------------ */

  const result = await uploadBufferToCloudinary({
    buffer: file.buffer,
    originalName: file.originalname,
    mimetype: file.mimetype,

    folder: isImage ? "colossus/images" : "colossus/documents",

    resourceType: isImage ? "image" : "raw",
  });

  /* ------------------------------------------------------------------------ */
  /* RETURN UPLOAD RESULT                                                     */
  /* ------------------------------------------------------------------------ */

  return {
    type: normalizedType,
    ...result,
  };
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default {
  uploadFile,
  uploadBufferToCloudinary,
};
