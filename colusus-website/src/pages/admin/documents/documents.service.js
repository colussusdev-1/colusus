import api from "../../../services/api";

/*
============================================================
ADMIN DOCUMENT SERVICE
============================================================
*/

/*
|--------------------------------------------------------------------------
| GET ALL DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents
|
*/

const getAllDocuments = async () => {
  const response = await api.get("/admin/documents");

  return response.data?.data || [];
};

/*
|--------------------------------------------------------------------------
| GET SINGLE DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/:id
|
*/

const getDocumentById = async (documentId) => {
  const response = await api.get(`/admin/documents/${documentId}`);

  return response.data?.data || null;
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENT PREVIEW
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/:id/view
|
| IMPORTANT:
|
| The backend streams the Cloudinary file.
| We request it as a Blob so the browser can display the
| document inside the admin preview instead of navigating
| directly to the Cloudinary URL.
|
|--------------------------------------------------------------------------
*/

const getDocumentPreview = async (documentId) => {
  const response = await api.get(`/admin/documents/${documentId}/view`, {
    responseType: "blob",
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE DOCUMENT STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/documents/:id/status
|
*/

const updateDocumentStatus = async (documentId, status, reviewNote = "") => {
  const response = await api.patch(`/admin/documents/${documentId}/status`, {
    status,
    reviewNote,
  });

  return response.data?.data || null;
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENTS FOR APPLICATION
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/application/:applicationId
|
*/

const getApplicationDocuments = async (applicationId) => {
  const response = await api.get(
    `/admin/documents/application/${applicationId}`,
  );

  return response.data?.data || [];
};

/*
|--------------------------------------------------------------------------
| GET DOCUMENTS BY STATUS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/status/:status
|
*/

const getDocumentsByStatus = async (status) => {
  const response = await api.get(`/admin/documents/status/${status}`);

  return response.data?.data || [];
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getAllDocuments,
  getDocumentById,
  getDocumentPreview,
  updateDocumentStatus,
  getApplicationDocuments,
  getDocumentsByStatus,
};
