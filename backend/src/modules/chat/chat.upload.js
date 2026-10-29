import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDirectory = path.resolve(process.cwd(), "private-uploads", "chat");

// Create the private upload directory if it doesn't exist.
fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedExtensions = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".doc",
  ".docx",
]);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeName = `${crypto.randomUUID()}${extension}`;

    callback(null, safeName);
  },
});

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    !allowedExtensions.has(extension) ||
    !allowedMimeTypes.has(file.mimetype)
  ) {
    return callback(
      new Error(
        "Unsupported file type. Upload PDF, JPG, PNG, WEBP, DOC, or DOCX files.",
      ),
    );
  }

  callback(null, true);
};

const chatUpload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
    fields: 10,
    parts: MAX_FILES + 10,
  },
});

export { uploadDirectory, MAX_FILE_SIZE, MAX_FILES };

export default chatUpload;
