import cloudinary from "../../config/cloudinary.js";

const uploadBufferToCloudinary = ({
  buffer,
  originalName,
  mimetype,
  folder = "colossus/form-submissions",
}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        type: "upload",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
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

    uploadStream.end(buffer);
  });
};

const uploadFile = async ({ file, type = "DOCUMENT" }) => {
  if (!file) {
    const error = new Error("No file was provided.");
    error.statusCode = 400;
    throw error;
  }

  const result = await uploadBufferToCloudinary({
    buffer: file.buffer,
    originalName: file.originalname,
    mimetype: file.mimetype,
    folder: "colossus/documents",
  });

  return {
    type: type.trim().toUpperCase(),
    ...result,
  };
};

export default {
  uploadFile,
  uploadBufferToCloudinary,
};
