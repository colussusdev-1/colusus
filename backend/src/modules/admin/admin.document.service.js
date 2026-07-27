import Document from "../documents/document.model.js";

/*
|--------------------------------------------------------------------------
| Get All Documents
|--------------------------------------------------------------------------
*/

const getAllDocuments = async () => {
  const documents = await Document.find()

    .populate("user", "name email")

    .populate("application", "type destinationCountry status")

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

    .populate(
      "user",

      "name email",
    )

    .populate(
      "application",

      "type destinationCountry status",
    );

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
) => {
  const document = await Document.findByIdAndUpdate(
    documentId,

    {
      status,

      reviewNote,
    },

    {
      new: true,

      runValidators: true,
    },
  );

  return document;
};

export default {
  getAllDocuments,

  getDocumentById,

  updateDocumentStatus,
};
