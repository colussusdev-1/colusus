/*
============================================================
colossus — STAFF CONSTANTS
============================================================
|
| Central constants for the Staff operational module.
|
| Staff accounts are existing User records with:
|
|     role: "STAFF"
|
| No separate Staff model is required for the current
| architecture.
|
============================================================
*/

/*
============================================================
STAFF ROLE
============================================================
*/

export const STAFF_ROLE = "STAFF";

/*
============================================================
STAFF-ACCESSIBLE ROLES
============================================================
|
| Staff operations may need to reference:
|
| - STAFF
| - ADMIN
| - CLIENT
|
| ADMIN remains the higher-level operational role.
|
============================================================
*/

export const STAFF_REFERENCE_ROLES = ["STAFF", "ADMIN", "CLIENT"];

/*
============================================================
APPLICATION STATUSES
============================================================
|
| These are the application states currently supported by
| the colossus application workflow.
|
============================================================
*/

export const APPLICATION_STATUSES = [
  "DRAFT",
  "IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCUMENT_REQUEST",
  "PROCESSING",
  "APPROVED",
  "REJECTED",
];

/*
============================================================
DOCUMENT STATUSES
============================================================
|
| These are the states a Staff member can use when
| reviewing client documents.
|
============================================================
*/

export const DOCUMENT_STATUSES = [
  "UPLOADED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "REUPLOAD_REQUIRED",
];

/*
============================================================
STAFF DASHBOARD LIMITS
============================================================
*/

export const DEFAULT_PAGE = 1;

export const DEFAULT_LIMIT = 20;

export const MAX_LIMIT = 100;

export const RECENT_APPLICATION_LIMIT = 10;

/*
============================================================
STAFF APPLICATION SORT
============================================================
|
| Newest records first.
|
============================================================
*/

export const DEFAULT_SORT = {
  createdAt: -1,
};

/*
============================================================
STAFF ACTIVITY TYPES
============================================================
|
| These describe Staff operational actions.
|
| They are intentionally separate from notification types.
|
============================================================
*/

export const STAFF_ACTIVITY_TYPES = {
  APPLICATION_VIEWED: "APPLICATION_VIEWED",

  APPLICATION_STATUS_UPDATED: "APPLICATION_STATUS_UPDATED",

  APPLICATION_NOTE_ADDED: "APPLICATION_NOTE_ADDED",

  DOCUMENT_VIEWED: "DOCUMENT_VIEWED",

  DOCUMENT_REVIEWED: "DOCUMENT_REVIEWED",

  DOCUMENT_APPROVED: "DOCUMENT_APPROVED",

  DOCUMENT_REJECTED: "DOCUMENT_REJECTED",

  DOCUMENT_REUPLOAD_REQUIRED: "DOCUMENT_REUPLOAD_REQUIRED",
};

/*
============================================================
STAFF DOCUMENT REVIEW ACTIONS
============================================================
*/

export const DOCUMENT_REVIEW_ACTIONS = {
  UNDER_REVIEW: "UNDER_REVIEW",

  APPROVED: "APPROVED",

  REJECTED: "REJECTED",

  REUPLOAD_REQUIRED: "REUPLOAD_REQUIRED",
};

/*
============================================================
STAFF ERROR MESSAGES
============================================================
*/

export const STAFF_ERRORS = {
  APPLICATION_NOT_FOUND: "Application not found.",

  APPLICATION_NOT_ASSIGNED: "This application is not assigned to you.",

  DOCUMENT_NOT_FOUND: "Document not found.",

  DOCUMENT_NOT_IN_APPLICATION:
    "This document does not belong to the selected application.",

  INVALID_APPLICATION_STATUS: "Invalid application status.",

  INVALID_DOCUMENT_STATUS: "Invalid document review status.",

  STAFF_NOT_FOUND: "Staff account not found.",

  STAFF_ACCESS_DENIED:
    "You do not have permission to perform this Staff operation.",
};

/*
============================================================
NORMALIZE STATUS
============================================================
*/

export const normalizeStatus = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/*
============================================================
PAGINATION
============================================================
*/

export const normalizePagination = (page, limit) => {
  const parsedPage = Math.max(Number(page) || DEFAULT_PAGE, 1);

  const parsedLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  return {
    page: parsedPage,

    limit: parsedLimit,

    skip: (parsedPage - 1) * parsedLimit,
  };
};

/*
============================================================
VALIDATE APPLICATION STATUS
============================================================
*/

export const isValidApplicationStatus = (status) => {
  return APPLICATION_STATUSES.includes(normalizeStatus(status));
};

/*
============================================================
VALIDATE DOCUMENT STATUS
============================================================
*/

export const isValidDocumentStatus = (status) => {
  return DOCUMENT_STATUSES.includes(normalizeStatus(status));
};
