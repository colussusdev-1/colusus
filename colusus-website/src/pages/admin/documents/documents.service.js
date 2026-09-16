import api from "../../../services/api";

/*
============================================================
ADMIN DOCUMENT SERVICE
============================================================
*/

const getAllDocuments = async () => {
  const response = await api.get("/admin/documents");

  return response.data?.data || [];
};

const getDocumentById = async (documentId) => {
  const response = await api.get(`/admin/documents/${documentId}`);

  return response.data?.data || null;
};

const updateDocumentStatus = async (documentId, status, reviewNote = "") => {
  const response = await api.patch(`/admin/documents/${documentId}/status`, {
    status,
    reviewNote,
  });

  return response.data?.data || null;
};

export default {
  getAllDocuments,
  getDocumentById,
  updateDocumentStatus,
};
