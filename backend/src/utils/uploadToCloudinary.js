import cloudinary from "../config/cloudinary.js";

/*
============================================================
UPLOAD BUFFER TO CLOUDINARY
============================================================
*/

const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "colusus/documents",

        resource_type: "auto",
      },

      (error, result) => {
        if (error) {
          reject(error);

          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export default uploadToCloudinary;
