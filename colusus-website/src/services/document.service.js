import api from "./api";

/*
============================================================
GET ALL CLIENT DOCUMENTS
============================================================
|
| Returns all documents belonging to the authenticated client.
|
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
|
| Returns only documents belonging to the selected application.
|
============================================================
*/

const getApplicationDocuments = async (applicationId) => {
  const { data } = await api.get(`/documents/application/${applicationId}`);

  return data.data;
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================
|
| Used by the Client Portal Document Viewer.
|
| GET /api/v1/documents/:id
|
| The backend verifies:
|
| - authenticated user
| - document ownership
| - application ownership
|
============================================================
*/

const getDocument = async (documentId) => {
  const { data } = await api.get(`/documents/${documentId}`);

  return data.data;
};

/*
============================================================
UPLOAD DOCUMENT
============================================================
|
| FormData is passed directly to Axios.
|
| DO NOT manually set Content-Type here.
|
| The browser automatically creates:
|
| multipart/form-data;
| boundary=------------------------
|
| This boundary is required by Multer.
|
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
|
| Used for document status / metadata updates.
|
============================================================
*/

const updateDocument = async (documentId, updateData) => {
  const { data } = await api.patch(`/documents/${documentId}`, updateData);

  return data.data;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getDocuments,

  getApplicationDocuments,

  getDocument,

  createDocument,

  updateDocument,
};
