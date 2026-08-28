import api from "../../../services/api";

/*
============================================================
ADMIN APPLICATION SERVICE
============================================================
|
| Handles all admin/staff API communication for applications.
|
| Responsibilities:
|
| - Get all applications
| - Get a single application
| - Get documents belonging to an application
| - Update application status
| - Get application internal notes
| - Add application internal notes
|
| IMPORTANT:
|
| This service is ONLY for the Admin Portal.
|
| Client application requests use:
|
| src/services/application.service.js
|
============================================================
*/

/*
============================================================
GET ALL APPLICATIONS
============================================================
|
| GET /api/v1/admin/applications
|
============================================================
*/

const getAllApplications = async () => {
  const { data } = await api.get("/admin/applications");

  return data;
};

/*
============================================================
GET SINGLE APPLICATION
============================================================
|
| GET /api/v1/admin/applications/:id
|
============================================================
*/

const getApplicationById = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const { data } = await api.get(`/admin/applications/${applicationId}`);

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
| → Documents tab
|
| IMPORTANT:
|
| This uses the ADMIN document endpoint.
|
| It does NOT use:
|
| /documents/application/:applicationId
|
| because that endpoint is client-scoped.
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
UPDATE APPLICATION STATUS
============================================================
|
| PATCH /api/v1/admin/applications/:id/status
|
| Body:
|
| {
|   status,
|   notes
| }
|
============================================================
*/

const updateApplicationStatus = async (applicationId, status, notes = "") => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!status) {
    throw new Error("Application status is required.");
  }

  const { data } = await api.patch(
    `/admin/applications/${applicationId}/status`,

    {
      status,

      notes,
    },
  );

  return data;
};

/*
============================================================
GET APPLICATION INTERNAL NOTES
============================================================
|
| GET /api/v1/admin/applications/:id/notes
|
| Returns notes created by:
|
| - ADMIN
| - STAFF
|
| These notes are private to the Admin Portal.
|
============================================================
*/

const getApplicationNotes = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const { data } = await api.get(`/admin/applications/${applicationId}/notes`);

  return data.data;
};

/*
============================================================
ADD APPLICATION INTERNAL NOTE
============================================================
|
| POST /api/v1/admin/applications/:id/notes
|
| Body:
|
| {
|   message: "Client needs to provide..."
| }
|
| The backend automatically records:
|
| - createdBy
| - createdAt
| - internalNotes[]
| - activity[]
| - lastUpdatedBy
|
============================================================
*/

const addApplicationNote = async (applicationId, message) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!message || !message.trim()) {
    throw new Error("Note message is required.");
  }

  const { data } = await api.post(
    `/admin/applications/${applicationId}/notes`,

    {
      message: message.trim(),
    },
  );

  return data.data;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  /*
  | Application retrieval
  */

  getAllApplications,

  getApplicationById,

  /*
  | Application documents
  */

  getApplicationDocuments,

  /*
  | Application management
  */

  updateApplicationStatus,

  /*
  | Application internal notes
  */

  getApplicationNotes,

  addApplicationNote,
};
