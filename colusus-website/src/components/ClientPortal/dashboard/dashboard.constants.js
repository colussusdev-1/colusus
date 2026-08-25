/*
============================================================
COLUSUS — CLIENT DASHBOARD CONSTANTS
============================================================

The dashboard is an OVERVIEW.

It summarizes:
- the client's applications
- the active application
- application journey
- document progress
- next actions
- recent activity

The detailed application workflow remains on:
 /portal/applications/:applicationId

============================================================
*/

/*
============================================================
STATUS CONFIG
============================================================
*/

export const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",

    className: "draft",

    description:
      "Your application has been created and is ready to be completed.",

    stage: 0,

    nextTitle: "Complete your application",

    nextDescription:
      "Upload the required documents and complete the remaining application steps.",

    clientControlled: true,

    terminal: false,
  },

  IN_PROGRESS: {
    label: "In Progress",

    className: "processing",

    description: "You are currently completing your application.",

    stage: 0,

    nextTitle: "Continue your application",

    nextDescription:
      "Continue completing the required steps in your application journey.",

    clientControlled: true,

    terminal: false,
  },

  SUBMITTED: {
    label: "Submitted",

    className: "submitted",

    description: "Your application has been submitted to Colusus.",

    stage: 2,

    nextTitle: "Application review",

    nextDescription:
      "Your application has been received and is awaiting review by the Colusus team.",

    clientControlled: false,

    terminal: false,
  },

  UNDER_REVIEW: {
    label: "Under Review",

    className: "review",

    description: "Your application is currently being reviewed by Colusus.",

    stage: 3,

    nextTitle: "Application review",

    nextDescription:
      "The Colusus team is reviewing the information and documents attached to your application.",

    clientControlled: false,

    terminal: false,
  },

  DOCUMENT_REQUEST: {
    label: "Documents Required",

    className: "documents",

    description: "Additional documents are required for your application.",

    stage: 1,

    nextTitle: "Documents required",

    nextDescription:
      "Please provide the requested documents before your application can continue.",

    clientControlled: true,

    terminal: false,
  },

  PROCESSING: {
    label: "Processing",

    className: "processing",

    description: "Your application is currently being processed.",

    stage: 4,

    nextTitle: "Application processing",

    nextDescription: "Your application is being processed by the Colusus team.",

    clientControlled: false,

    terminal: false,
  },

  APPROVED: {
    label: "Approved",

    className: "approved",

    description: "Your application has been approved.",

    stage: 5,

    nextTitle: "Application approved",

    nextDescription:
      "Your migration application has reached a successful final decision.",

    clientControlled: false,

    terminal: true,
  },

  REJECTED: {
    label: "Rejected",

    className: "rejected",

    description: "Your application has reached a final decision.",

    stage: 5,

    nextTitle: "Application decision",

    nextDescription:
      "Please review the latest information provided by your Colusus team.",

    clientControlled: false,

    terminal: true,
  },
};

/*
============================================================
CLIENT APPLICATION JOURNEY
============================================================

This is the high-level journey shown on the dashboard.

IMPORTANT:

This is NOT a direct copy of every backend status.

The dashboard presents the client's journey as:

1. Documents
2. Review
3. Submitted
4. Under Review
5. Processing
6. Decision

Backend statuses are mapped into these stages.

============================================================
*/

export const JOURNEY_STAGES = [
  {
    key: "documents",

    step: "DOCUMENTS",

    label: "Documents",

    shortLabel: "Documents",

    description: "Upload the documents required for your application.",

    index: 0,

    statuses: ["DRAFT", "IN_PROGRESS", "DOCUMENT_REQUEST"],
  },

  {
    key: "review",

    step: "REVIEW",

    label: "Application Review",

    shortLabel: "Review",

    description: "Review your information before submitting your application.",

    index: 1,

    statuses: ["IN_PROGRESS"],
  },

  {
    key: "submitted",

    step: "SUBMITTED",

    label: "Application Submitted",

    shortLabel: "Submitted",

    description: "Your application has been submitted to Colusus.",

    index: 2,

    statuses: ["SUBMITTED"],
  },

  {
    key: "under-review",

    step: "UNDER_REVIEW",

    label: "Application Review",

    shortLabel: "Under Review",

    description: "The Colusus team is reviewing your application.",

    index: 3,

    statuses: ["UNDER_REVIEW"],
  },

  {
    key: "processing",

    step: "PROCESSING",

    label: "Application Processing",

    shortLabel: "Processing",

    description: "Your application is being processed.",

    index: 4,

    statuses: ["PROCESSING"],
  },

  {
    key: "decision",

    step: "DECISION",

    label: "Decision",

    shortLabel: "Decision",

    description: "Your application has reached its final outcome.",

    index: 5,

    statuses: ["APPROVED", "REJECTED"],
  },
];

/*
============================================================
STATUS → JOURNEY STAGE MAPPING
============================================================

This is used when the application does not have a reliable
currentStep value.

============================================================
*/

export const STATUS_STAGE_MAP = {
  DRAFT: 0,

  IN_PROGRESS: 0,

  DOCUMENT_REQUEST: 0,

  SUBMITTED: 2,

  UNDER_REVIEW: 3,

  PROCESSING: 4,

  APPROVED: 5,

  REJECTED: 5,
};

/*
============================================================
CLIENT CONTROLLED STATUSES
============================================================
*/

export const CLIENT_CONTROLLED_STATUSES = [
  "DRAFT",

  "IN_PROGRESS",

  "DOCUMENT_REQUEST",
];

/*
============================================================
STAFF CONTROLLED STATUSES
============================================================
*/

export const STAFF_CONTROLLED_STATUSES = [
  "SUBMITTED",

  "UNDER_REVIEW",

  "PROCESSING",

  "APPROVED",

  "REJECTED",
];

/*
============================================================
TERMINAL STATUSES
============================================================
*/

export const TERMINAL_STATUSES = ["APPROVED", "REJECTED"];

/*
============================================================
ACTIVE STATUSES
============================================================

Used when deciding which application should be considered
the client's active/primary application.

============================================================
*/

export const ACTIVE_STATUSES = [
  "DRAFT",

  "IN_PROGRESS",

  "DOCUMENT_REQUEST",

  "SUBMITTED",

  "UNDER_REVIEW",

  "PROCESSING",
];

/*
============================================================
DOCUMENT STATUSES
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
DOCUMENT STATUS CONFIG
============================================================

Used by the dashboard document overview.

============================================================
*/

export const DOCUMENT_STATUS_CONFIG = {
  UPLOADED: {
    label: "Uploaded",

    className: "uploaded",
  },

  UNDER_REVIEW: {
    label: "Under Review",

    className: "review",
  },

  APPROVED: {
    label: "Approved",

    className: "approved",
  },

  REJECTED: {
    label: "Rejected",

    className: "rejected",
  },

  REUPLOAD_REQUIRED: {
    label: "Action Required",

    className: "attention",
  },
};

/*
============================================================
APPLICATION STEPS
============================================================
*/

export const APPLICATION_STEPS = {
  DOCUMENTS: "DOCUMENTS",

  REVIEW: "REVIEW",
};

/*
============================================================
DASHBOARD APPLICATION FILTERS
============================================================
*/

export const APPLICATION_FILTERS = {
  ALL: "ALL",

  ACTIVE: "ACTIVE",

  DRAFT: "DRAFT",

  IN_PROGRESS: "IN_PROGRESS",

  SUBMITTED: "SUBMITTED",

  UNDER_REVIEW: "UNDER_REVIEW",

  PROCESSING: "PROCESSING",

  COMPLETED: "COMPLETED",
};

/*
============================================================
COMPLETED APPLICATION STATUSES
============================================================
*/

export const COMPLETED_STATUSES = ["APPROVED", "REJECTED"];

/*
============================================================
APPLICATION SORT OPTIONS
============================================================

The overview can later allow the client to switch between
recent and active applications.

============================================================
*/

export const APPLICATION_SORT_OPTIONS = {
  RECENT: "RECENT",

  ACTIVE: "ACTIVE",

  PROGRESS: "PROGRESS",
};

/*
============================================================
ACTIVE APPLICATION PRIORITY
============================================================

When a client has multiple applications, the dashboard
should prioritize applications in this order.

Example:

DOCUMENT_REQUEST should appear before PROCESSING because
the client actually needs to do something.

============================================================
*/

export const ACTIVE_APPLICATION_PRIORITY = [
  "DOCUMENT_REQUEST",

  "IN_PROGRESS",

  "DRAFT",

  "UNDER_REVIEW",

  "PROCESSING",

  "SUBMITTED",

  "APPROVED",

  "REJECTED",
];

/*
============================================================
DASHBOARD DISPLAY LIMITS
============================================================

These are UI limits only.

They do NOT limit backend data.

============================================================
*/

export const DASHBOARD_LIMITS = {
  RECENT_ACTIVITY: 5,

  RECENT_APPLICATIONS: 4,

  APPLICATION_HISTORY: 6,
};

/*
============================================================
DOCUMENT PROGRESS DEFAULT
============================================================

Used whenever an application has no documentProgress yet.

============================================================
*/

export const DEFAULT_DOCUMENT_PROGRESS = {
  required: 0,

  uploaded: 0,

  approved: 0,

  pending: 0,

  rejected: 0,

  missing: [],

  percentage: 0,

  complete: false,
};

/*
============================================================
DASHBOARD EMPTY STATES
============================================================
*/

export const DASHBOARD_EMPTY_STATES = {
  NO_APPLICATIONS: {
    title: "Start your migration journey",

    description:
      "Explore available migration pathways and choose the one that fits your goals.",
  },

  NO_DOCUMENTS: {
    title: "No documents uploaded",

    description:
      "Your document activity will appear here once you begin your application.",
  },

  NO_ACTIVITY: {
    title: "No recent activity",

    description: "Updates from your application journey will appear here.",
  },
};
