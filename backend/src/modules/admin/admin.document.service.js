import Document from "../documents/document.model.js";

import documentService from "../documents/document.service.js";

/*
|--------------------------------------------------------------------------
| GET ALL DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents
|
| Returns all documents across all client applications.
|
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
|
| GET /api/v1/admin/documents/application/:applicationId
|
| Used by:
|
| Admin Application Details
|        ↓
| Documents tab
|
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
|
| GET /api/v1/admin/documents/:id
|
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
| UPDATE DOCUMENT STATUS
|--------------------------------------------------------------------------
|
| Admin / Staff document review.
|
| IMPORTANT:
|
| We deliberately DO NOT update the Document model directly here.
|
| Instead we use:
|
| documentService.updateDocumentStatusByStaff()
|
| because that service already handles:
|
| - document status
| - review note
| - reviewer
| - reviewedAt
| - application document progress
| - application status transitions
| - application timeline activity
| - client notifications
| - staff/admin notifications
|
|--------------------------------------------------------------------------
*/

const updateDocumentStatus = async (
  documentId,
  status,
  reviewNote = "",
  adminId = null,
) => {
  /*
  |--------------------------------------------------------------------------
  | UPDATE THROUGH CENTRAL DOCUMENT SERVICE
  |--------------------------------------------------------------------------
  */

  const result = await documentService.updateDocumentStatusByStaff(
    documentId,
    {
      status,

      reviewNote,
    },
    adminId,
  );

  /*
  |--------------------------------------------------------------------------
  | RETURN NULL IF DOCUMENT DOES NOT EXIST
  |--------------------------------------------------------------------------
  */

  if (!result) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | POPULATE DOCUMENT
  |--------------------------------------------------------------------------
  |
  | The document service returns the raw document.
  |
  | Populate it here so the Admin Portal receives the complete
  | document structure.
  |
  |--------------------------------------------------------------------------
  */

  const updatedDocument = await Document.findById(result.document._id)
    .populate("user", "name email")
    .populate(
      "application",
      "type destinationCountry status currentStep progress",
    )
    .populate("reviewedBy", "name email");

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return updatedDocument;
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENTS BY STATUS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/status/:status
|
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

  updateDocumentStatus,

  getDocumentsByStatus,
};
