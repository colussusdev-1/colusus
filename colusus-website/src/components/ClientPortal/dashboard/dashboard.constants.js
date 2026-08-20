/*
============================================================
CLIENT DASHBOARD CONSTANTS
============================================================
*/

export const STATUS_CONFIG = {
  SUBMITTED: {
    label: "Submitted",
    className: "submitted",
    description:
      "Your application has been submitted and is awaiting review.",
    stage: 0,
    nextTitle: "Application review",
    nextDescription:
      "Our team is currently reviewing the information attached to your application.",
  },

  UNDER_REVIEW: {
    label: "Under Review",
    className: "review",
    description:
      "Our team is currently reviewing your application.",
    stage: 1,
    nextTitle: "Application review",
    nextDescription:
      "Our team is currently reviewing the information attached to your application.",
  },

  DOCUMENT_REQUEST: {
    label: "Documents Required",
    className: "documents",
    description:
      "Additional documents are required for your application.",
    stage: 1,
    nextTitle: "Documents required",
    nextDescription:
      "Additional information is required before your application can continue.",
  },

  PROCESSING: {
    label: "Processing",
    className: "processing",
    description:
      "Your application is currently being processed.",
    stage: 2,
    nextTitle: "Application processing",
    nextDescription:
      "Your application is currently being processed by the Colusus team.",
  },

  APPROVED: {
    label: "Approved",
    className: "approved",
    description:
      "Your application has been approved.",
    stage: 3,
    nextTitle: "Application approved",
    nextDescription:
      "Your application has been approved. Further information will be provided by your team.",
  },

  REJECTED: {
    label: "Rejected",
    className: "rejected",
    description:
      "Your application requires attention.",
    stage: 0,
    nextTitle: "Application requires attention",
    nextDescription:
      "Please review the latest information from your Colusus team.",
  },
};

export const JOURNEY_STAGES = [
  {
    key: "submitted",
    label: "Application Submitted",
    description: "Application received",
    index: 0,
  },
  {
    key: "review",
    label: "Application Review",
    description: "Information is being reviewed",
    index: 1,
  },
  {
    key: "processing",
    label: "Application Processing",
    description: "Application is being processed",
    index: 2,
  },
  {
    key: "decision",
    label: "Decision",
    description: "Final outcome",
    index: 3,
  },
];
