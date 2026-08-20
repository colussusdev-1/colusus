/* ============================================================
   APPLICATION UTILITIES
============================================================ */

/* ============================================================
   FORMAT APPLICATION TYPE
============================================================ */

export const formatApplicationType = (type) => {
  if (!type) {
    return "Migration Application";
  }

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/* ============================================================
   FORMAT APPLICATION STATUS
============================================================ */

export const formatApplicationStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/* ============================================================
   FORMAT APPLICATION DATE
============================================================ */

export const formatApplicationDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

/* ============================================================
   STATUS CLASS
============================================================ */

export const getStatusClass = (status) => {
  return (status || "unknown").toLowerCase().replaceAll("_", "-");
};

/* ============================================================
   APPLICATION PROGRESS
============================================================ */

export const getApplicationProgress = (status) => {
  const progressMap = {
    NEW: 5,

    CONSULTATION: 15,

    DOCUMENT_COLLECTION: 30,

    UNDER_REVIEW: 45,

    DOCUMENT_REQUEST: 45,

    PROCESSING: 70,

    SUBMITTED: 15,

    COMPLETED: 100,

    APPROVED: 100,

    REJECTED: 0,
  };

  return progressMap[status] ?? 0;
};

/* ============================================================
   STATUS DESCRIPTION
============================================================ */

export const getStatusDescription = (status) => {
  const descriptions = {
    NEW: "Your application has been created.",

    CONSULTATION: "Your application is being assessed.",

    DOCUMENT_COLLECTION: "Documents are being collected.",

    UNDER_REVIEW: "Your application is currently being reviewed.",

    DOCUMENT_REQUEST: "Additional documents are required.",

    PROCESSING: "Your application is currently being processed.",

    SUBMITTED: "Your application has been submitted and is awaiting review.",

    COMPLETED: "Your application has been completed.",

    APPROVED: "Your application has been approved.",

    REJECTED: "Your application requires attention.",
  };

  return (
    descriptions[status] ||
    "Your application is being managed by the Colusus team."
  );
};
