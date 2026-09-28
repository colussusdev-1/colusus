import api from "../../../services/api";

/*
============================================================
ADMIN DOCUMENT SERVICE
============================================================
|
| Handles document-related API communication for the
| Admin / Staff portal.
|
| Backend endpoints:
|
| GET   /api/v1/admin/documents
| GET   /api/v1/admin/documents/application/:applicationId
| GET   /api/v1/admin/documents/:id
| GET   /api/v1/admin/documents/status/:status
| GET   /api/v1/admin/documents/:id/view
| PATCH /api/v1/admin/documents/:id/status
|
============================================================
*/

/*
============================================================
GET ALL DOCUMENTS
============================================================
*/

const getAllDocuments = async () => {
  const response = await api.get("/admin/documents");

  return response.data?.data || [];
};

/*
============================================================
GET APPLICATION DOCUMENTS
============================================================
*/

const getApplicationDocuments = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const response = await api.get(
    `/admin/documents/application/${applicationId}`,
  );

  return response.data?.data || [];
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================
*/

const getDocumentById = async (documentId) => {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  const response = await api.get(`/admin/documents/${documentId}`);

  return response.data?.data || null;
};

/*
============================================================
GET DOCUMENT PREVIEW
============================================================
|
| GET /api/v1/admin/documents/:id/view
|
| The backend retrieves the Cloudinary file and streams it
| back to the browser.
|
| The frontend receives the response as a Blob so the
| browser does NOT navigate directly to Cloudinary.
|
============================================================
*/

const getDocumentPreview = async (documentId) => {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  const response = await api.get(`/admin/documents/${documentId}/view`, {
    responseType: "blob",
  });

  return response.data;
};

/*
============================================================
GET DOCUMENTS BY STATUS
============================================================
*/

const getDocumentsByStatus = async (status) => {
  if (!status) {
    throw new Error("Document status is required.");
  }

  const response = await api.get(`/admin/documents/status/${status}`);

  return response.data?.data || [];
};

/*
============================================================
UPDATE DOCUMENT STATUS
============================================================
*/

const updateDocumentStatus = async (documentId, status, reviewNote = "") => {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  if (!status) {
    throw new Error("Document status is required.");
  }

  const response = await api.patch(`/admin/documents/${documentId}/status`, {
    status,
    reviewNote,
  });

  return response.data?.data || null;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getAllDocuments,
  getApplicationDocuments,
  getDocumentById,
  getDocumentPreview,
  getDocumentsByStatus,
  updateDocumentStatus,
};
