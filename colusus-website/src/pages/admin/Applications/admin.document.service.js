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
| PATCH /api/v1/admin/documents/:id/status
|
============================================================
*/

/*
============================================================
GET ALL DOCUMENTS
============================================================
|
| GET /api/v1/admin/documents
|
============================================================
*/

const getAllDocuments = async () => {
  const { data } = await api.get("/admin/documents");

  return data;
};

/*
============================================================
GET APPLICATION DOCUMENTS
============================================================
|
| GET /api/v1/admin/documents/application/:applicationId
|
| Used by:
|
| Admin Application Details
|        ↓
| Documents
|
============================================================
*/

const getApplicationDocuments = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const { data } = await api.get(
    `/admin/documents/application/${applicationId}`,
  );

  return data;
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================
|
| GET /api/v1/admin/documents/:id
|
============================================================
*/

const getDocumentById = async (documentId) => {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  const { data } = await api.get(`/admin/documents/${documentId}`);

  return data;
};

/*
============================================================
GET DOCUMENTS BY STATUS
============================================================
|
| GET /api/v1/admin/documents/status/:status
|
============================================================
*/

const getDocumentsByStatus = async (status) => {
  if (!status) {
    throw new Error("Document status is required.");
  }

  const { data } = await api.get(`/admin/documents/status/${status}`);

  return data;
};

/*
============================================================
UPDATE DOCUMENT STATUS
============================================================
|
| PATCH /api/v1/admin/documents/:id/status
|
| Body:
|
| {
|   status: "APPROVED",
|   reviewNote: "Document verified successfully."
| }
|
============================================================
*/

const updateDocumentStatus = async (documentId, status, reviewNote = "") => {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  if (!status) {
    throw new Error("Document status is required.");
  }

  const { data } = await api.patch(`/admin/documents/${documentId}/status`, {
    status,
    reviewNote,
  });

  return data;
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

  getDocumentsByStatus,

  updateDocumentStatus,
};
