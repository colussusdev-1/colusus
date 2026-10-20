import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const type = String(req.body?.type || "DOCUMENT")
    .trim()
    .toUpperCase();

  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

  const allowedDocumentTypes = ["application/pdf", "image/jpeg", "image/png"];

  const allowedTypes =
    type === "IMAGE" ? allowedImageTypes : allowedDocumentTypes;

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(
    new Error(
      type === "IMAGE"
        ? "Only JPEG, PNG and WebP images are allowed."
        : "Only PDF, JPG and PNG files are allowed.",
    ),
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
