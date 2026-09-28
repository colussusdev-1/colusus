import https from "https";

import Document from "../documents/document.model.js";
import documentService from "../documents/document.service.js";

/*
|--------------------------------------------------------------------------
| GET ALL DOCUMENTS
|--------------------------------------------------------------------------
*/

const getAllDocuments = async () => {
  const documents = await Document.find()
    .populate("user", "name email")
    .populate(
      "application",
      "type destinationCountry status currentStep progress",
    )
    .populate("reviewedBy", "name email")
    .sort({
      createdAt: -1,
    });

  return documents;
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENTS FOR APPLICATION
|--------------------------------------------------------------------------
*/

const getApplicationDocuments = async (applicationId) => {
  const documents = await Document.find({
    application: applicationId,
  })
    .populate("user", "name email")
    .populate(
      "application",
      "type destinationCountry status currentStep progress",
    )
    .populate("reviewedBy", "name email")
    .sort({
      createdAt: -1,
    });

  return documents;
};

/*
|--------------------------------------------------------------------------
| GET SINGLE DOCUMENT
|--------------------------------------------------------------------------
*/

const getDocumentById = async (documentId) => {
  const document = await Document.findById(documentId)
    .populate("user", "name email")
    .populate(
      "application",
      "type destinationCountry status currentStep progress",
    )
    .populate("reviewedBy", "name email");

  return document;
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENT FILE STREAM
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/:id/view
|
| The backend retrieves the stored Cloudinary file and streams it
| through the authenticated admin/staff endpoint.
|--------------------------------------------------------------------------
*/

const getDocumentStream = async (documentId) => {
  const document = await Document.findById(documentId);

  if (!document) {
    const error = new Error("Document not found.");

    error.statusCode = 404;

    throw error;
  }

  if (!document.fileUrl) {
    const error = new Error("Document file is not available.");

    error.statusCode = 404;

    throw error;
  }

  return new Promise((resolve, reject) => {
    const request = https.get(document.fileUrl, (response) => {
      /*
      |--------------------------------------------------------------------------
      | VALIDATE CLOUDINARY RESPONSE
      |--------------------------------------------------------------------------
      */

      if (
        !response.statusCode ||
        response.statusCode < 200 ||
        response.statusCode >= 300
      ) {
        response.resume();

        const error = new Error(
          `Unable to retrieve document file. Cloudinary returned ${response.statusCode}.`,
        );

        error.statusCode = 502;

        return reject(error);
      }

      /*
      |--------------------------------------------------------------------------
      | DETERMINE MIME TYPE
      |--------------------------------------------------------------------------
      */

      const fileName =
        document.originalFileName ||
        document.name ||
        document.documentName ||
        "document";

      const cleanFileName = String(fileName).split("?")[0].split("#")[0];

      const extension = cleanFileName.split(".").pop().toLowerCase();

      const mimeTypes = {
        pdf: "application/pdf",

        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",

        txt: "text/plain",

        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        csv: "text/csv",
      };

      const cloudinaryContentType = response.headers["content-type"];

      const contentType =
        mimeTypes[extension] ||
        (cloudinaryContentType &&
        cloudinaryContentType !== "application/octet-stream"
          ? cloudinaryContentType
          : "application/octet-stream");

      /*
      |--------------------------------------------------------------------------
      | RETURN STREAM
      |--------------------------------------------------------------------------
      */

      resolve({
        document,
        stream: response,
        contentType,
        contentLength: response.headers["content-length"] || null,
      });
    });

    /*
    |--------------------------------------------------------------------------
    | REQUEST ERROR
    |--------------------------------------------------------------------------
    */

    request.on("error", (error) => {
      reject(error);
    });

    /*
    |--------------------------------------------------------------------------
    | REQUEST TIMEOUT
    |--------------------------------------------------------------------------
    */

    request.setTimeout(30000, () => {
      request.destroy(new Error("Document preview request timed out."));
    });
  });
};

/*
|--------------------------------------------------------------------------
| UPDATE DOCUMENT STATUS
|--------------------------------------------------------------------------
*/

const updateDocumentStatus = async (
  documentId,
  status,
  reviewNote = "",
  adminId = null,
) => {
  const result = await documentService.updateDocumentStatusByStaff(
    documentId,
    {
      status,
      reviewNote,
    },
    adminId,
  );

  if (!result) {
    return null;
  }

  const updatedDocument = await Document.findById(result.document._id)
    .populate("user", "name email")
    .populate(
      "application",
      "type destinationCountry status currentStep progress",
    )
    .populate("reviewedBy", "name email");

  return updatedDocument;
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENTS BY STATUS
|--------------------------------------------------------------------------
*/

const getDocumentsByStatus = async (status) => {
  return await Document.find({
    status: String(status || "")
      .trim()
      .toUpperCase(),
  })
    .populate("user", "name email")
    .populate(
      "application",
      "type destinationCountry status currentStep progress",
    )
    .populate("reviewedBy", "name email")
    .sort({
      createdAt: -1,
    });
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getAllDocuments,
  getApplicationDocuments,
  getDocumentById,
  getDocumentStream,
  updateDocumentStatus,
  getDocumentsByStatus,
};
