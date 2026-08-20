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
UPLOAD DOCUMENT
============================================================

FormData is passed directly to Axios.

DO NOT manually set Content-Type here.

The browser automatically creates:

multipart/form-data;
boundary=------------------------

This boundary is required by Multer.
============================================================
*/

const createDocument = async (formData) => {
  const { data } = await api.post("/documents", formData);

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
