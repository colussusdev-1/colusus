import Document from "../documents/document.model.js";
import workflowService from "../workflows/workflow.service.js";

/*
|--------------------------------------------------------------------------
| Get All Documents
|--------------------------------------------------------------------------
*/

const getAllDocuments = async () => {
  const documents = await Document.find()

    .populate("user", "name email")

    .populate("application", "type destinationCountry status")

    .populate("reviewedBy", "name email")

    .sort({
      createdAt: -1,
    });

  return documents;
};

/*
|--------------------------------------------------------------------------
| Get Single Document
|--------------------------------------------------------------------------
*/

const getDocumentById = async (documentId) => {
  const document = await Document.findById(documentId)

    .populate("user", "name email")

    .populate("application", "type destinationCountry status")

    .populate("reviewedBy", "name email");

  return document;
};

/*
|--------------------------------------------------------------------------
| Update Document Status
|--------------------------------------------------------------------------
*/

const updateDocumentStatus = async (
  documentId,

  status,

  reviewNote,

  adminId,
) => {
  const document = await Document.findByIdAndUpdate(
    documentId,

    {
      status,

      reviewNote,

      reviewedBy: adminId,

      reviewedAt: new Date(),
    },

    {
      new: true,

      runValidators: true,
    },
  );

  if (!document) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Trigger Workflow Automation
  |--------------------------------------------------------------------------
  */

  await workflowService.handleDocumentStatusChange({
    userId: document.user,

    documentId: document._id,

    status: document.status,
  });

  return document;
};

/*
|--------------------------------------------------------------------------
| Get Documents By Status
|--------------------------------------------------------------------------
*/

const getDocumentsByStatus = async (status) => {
  return await Document.find({
    status,
  })

    .populate("user", "name email")

    .populate("application", "type destinationCountry status")

    .sort({
      createdAt: -1,
    });
};

export default {
  getAllDocuments,

  getDocumentById,

  updateDocumentStatus,

  getDocumentsByStatus,
};
