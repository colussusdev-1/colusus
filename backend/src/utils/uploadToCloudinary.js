import cloudinary from "../config/cloudinary.js";

/*
============================================================
UPLOAD BUFFER TO CLOUDINARY
============================================================
Used by the document module for PDFs and other applicant files.
============================================================
*/

const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("No file buffer was provided."));
    }

    const uploadOptions = {
      folder: options.folder || "colossus/documents",

      // Documents such as PDF files must be uploaded as raw assets.
      resource_type: "raw",

      // Explicit upload delivery type.
      type: "upload",

      // Keep Cloudinary from modifying the original document.
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    console.log("\n=================================");
    console.log("CLOUDINARY DOCUMENT UPLOAD");
    console.log("=================================");
    console.log({
      folder: uploadOptions.folder,
      resource_type: uploadOptions.resource_type,
      type: uploadOptions.type,
      bufferSize: fileBuffer.length,
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("\n=================================");
          console.error("CLOUDINARY DOCUMENT UPLOAD FAILED");
          console.error("=================================");
          console.error(error);

          return reject(error);
        }

        console.log("\n=================================");
        console.log("CLOUDINARY DOCUMENT UPLOAD SUCCESS");
        console.log("=================================");
        console.log({
          public_id: result.public_id,
          resource_type: result.resource_type,
          type: result.type,
          format: result.format,
          bytes: result.bytes,
          secure_url: result.secure_url,
        });

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export default uploadToCloudinary;
