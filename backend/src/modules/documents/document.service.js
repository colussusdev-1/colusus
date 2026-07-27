import Document from "./document.model.js";

const createDocument = async (data) => {
  const document = await Document.create(data);

  return document;
};

const getUserDocuments = async (userId) => {
  const documents = await Document.find({
    user: userId,
  })
    .populate("application", "type destinationCountry status")
    .sort({
      createdAt: -1,
    });

  return documents;
};

const getApplicationDocuments = async (applicationId, userId) => {
  const documents = await Document.find({
    application: applicationId,

    user: userId,
  }).sort({
    createdAt: -1,
  });

  return documents;
};

const updateDocumentStatus = async (documentId, userId, data) => {
  const document = await Document.findOneAndUpdate(
    {
      _id: documentId,

      user: userId,
    },

    data,

    {
      new: true,

      runValidators: true,
    },
  );

  return document;
};

export default {
  createDocument,

  getUserDocuments,

  getApplicationDocuments,

  updateDocumentStatus,
};
