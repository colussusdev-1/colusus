import api from "../../../../services/api";

/*
============================================================
colossus — STAFF SERVICE
============================================================

Frontend API service for the Staff operational portal.

IMPORTANT:

Staff routes are separate from Admin routes.

Admin:
    /api/v1/admin/...

Staff:
    /api/v1/staff/...

The backend is responsible for enforcing:

    authenticated user === STAFF
    application.assignedTo === authenticated staff user

This service only handles API communication.

============================================================
*/

/*
============================================================
GET STAFF PROFILE
============================================================

GET /api/v1/staff/profile

============================================================
*/

const getStaffProfile = async () => {
  const { data } = await api.get("/staff/profile");

  return data;
};

/*
============================================================
GET STAFF DASHBOARD
============================================================

GET /api/v1/staff/dashboard

Returns:

- assigned application statistics
- document statistics
- recent assigned applications

============================================================
*/

const getDashboard = async () => {
  const { data } = await api.get("/staff/dashboard");

  return data;
};

/*
============================================================
GET ASSIGNED APPLICATIONS
============================================================

GET /api/v1/staff/applications

Optional:

    page
    limit
    status

Example:

    /staff/applications?page=1&limit=20
    /staff/applications?status=UNDER_REVIEW

============================================================
*/

const getAssignedApplications = async ({
  page = 1,
  limit = 20,
  status = "",
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (status) {
    params.status = status;
  }

  const { data } = await api.get("/staff/applications", {
    params,
  });

  return data;
};

/*
============================================================
GET SINGLE ASSIGNED APPLICATION
============================================================

GET /api/v1/staff/applications/:id

IMPORTANT:

The backend only returns the application if it is assigned
to the authenticated Staff member.

============================================================
*/

const getAssignedApplicationById = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const { data } = await api.get(`/staff/applications/${applicationId}`);

  return data;
};

/*
============================================================
UPDATE APPLICATION STATUS
============================================================

PATCH /api/v1/staff/applications/:id/status

Body:

{
  status,
  notes
}

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
    `/staff/applications/${applicationId}/status`,
    {
      status,
      notes,
    },
  );

  return data;
};

/*
============================================================
GET APPLICATION NOTES
============================================================

GET /api/v1/staff/applications/:id/notes

Returns internal notes for an assigned application.

============================================================
*/

const getApplicationNotes = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const { data } = await api.get(`/staff/applications/${applicationId}/notes`);

  return data;
};

/*
============================================================
ADD APPLICATION NOTE
============================================================

POST /api/v1/staff/applications/:id/notes

Body:

{
  message: "Client needs to provide..."
}

============================================================
*/

const addApplicationNote = async (applicationId, message) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!message || !String(message).trim()) {
    throw new Error("Note message is required.");
  }

  const { data } = await api.post(
    `/staff/applications/${applicationId}/notes`,
    {
      message: String(message).trim(),
    },
  );

  return data;
};

/*
============================================================
GET APPLICATION DOCUMENTS
============================================================

GET /api/v1/staff/applications/:id/documents

Returns documents belonging to an application assigned
to the authenticated Staff member.

============================================================
*/

const getApplicationDocuments = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const { data } = await api.get(
    `/staff/applications/${applicationId}/documents`,
  );

  return data;
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================

GET /api/v1/staff/documents/:id

The backend verifies that the document belongs to an
application assigned to the authenticated Staff member.

============================================================
*/

const getDocumentById = async (documentId) => {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  const { data } = await api.get(`/staff/documents/${documentId}`);

  return data;
};

/*
============================================================
REVIEW DOCUMENT
============================================================

PATCH /api/v1/staff/documents/:id/review

Body:

{
  status: "APPROVED",
  reviewNote: "Document verified successfully."
}

Supported statuses:

    UNDER_REVIEW
    APPROVED
    REJECTED
    REUPLOAD_REQUIRED

============================================================
*/

const reviewDocument = async (documentId, status, reviewNote = "") => {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  if (!status) {
    throw new Error("Document review status is required.");
  }

  const { data } = await api.patch(`/staff/documents/${documentId}/review`, {
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
  /*
  | Staff
  */

  getStaffProfile,

  /*
  | Dashboard
  */

  getDashboard,

  /*
  | Applications
  */

  getAssignedApplications,

  getAssignedApplicationById,

  updateApplicationStatus,

  /*
  | Notes
  */

  getApplicationNotes,

  addApplicationNote,

  /*
  | Documents
  */

  getApplicationDocuments,

  getDocumentById,

  reviewDocument,
};
