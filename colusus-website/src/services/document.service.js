import api from "./api";

/*
============================================================
GET ALL CLIENT DOCUMENTS
============================================================
*/

const getDocuments = async () => {
  const { data } = await api.get("/documents");

  return data.data;
};

/*
============================================================
GET DOCUMENTS FOR SPECIFIC APPLICATION
============================================================
*/

const getApplicationDocuments = async (applicationId) => {
  const { data } = await api.get(`/documents/application/${applicationId}`);

  return data.data;
};

/*
============================================================
CREATE DOCUMENT
============================================================

NOTE:

This currently sends document metadata only.

Actual file-upload storage will be connected
after we add the backend upload layer.
============================================================
*/

const createDocument = async (documentData) => {
  const { data } = await api.post("/documents", documentData);

  return data.data;
};

/*
============================================================
UPDATE DOCUMENT
============================================================
*/

const updateDocument = async (documentId, updateData) => {
  const { data } = await api.patch(`/documents/${documentId}`, updateData);

  return data.data;
};

export default {
  getDocuments,

  getApplicationDocuments,

  createDocument,

  updateDocument,
};
