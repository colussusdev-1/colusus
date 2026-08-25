import {
  STATUS_CONFIG,
  JOURNEY_STAGES,
  STATUS_STAGE_MAP,
  ACTIVE_STATUSES,
  TERMINAL_STATUSES,
  ACTIVE_APPLICATION_PRIORITY,
  DEFAULT_DOCUMENT_PROGRESS,
} from "./dashboard.constants";

/*
============================================================
APPLICATION TYPE
============================================================
*/

export const formatApplicationType = (type) => {
  if (!type) {
    return "Application";
  }

  return String(type)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/*
============================================================
COUNTRY NAME
============================================================
*/

export const formatCountryName = (country) => {
  if (!country) {
    return "Unknown";
  }

  return String(country)
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/*
============================================================
DATE
============================================================
*/

export const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/*
============================================================
TIME
============================================================
*/

export const formatTime = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/*
============================================================
DATE + TIME
============================================================
*/

export const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(date);

  if (formattedDate === "—") {
    return "—";
  }

  if (formattedTime === "—") {
    return formattedDate;
  }

  return `${formattedDate} · ${formattedTime}`;
};

/*
============================================================
NORMALIZE STATUS
============================================================
*/

export const normalizeStatus = (status) => {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/*
============================================================
STATUS CONFIG
============================================================
*/

export const getStatusConfig = (status) => {
  const normalizedStatus = normalizeStatus(status);

  return STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.DRAFT;
};

/*
============================================================
DOCUMENT PROGRESS
============================================================

Normalizes the backend documentProgress object so every
dashboard component receives the same structure.

============================================================
*/

export const getDocumentProgress = (application) => {
  if (!application) {
    return {
      ...DEFAULT_DOCUMENT_PROGRESS,
      missing: [],
    };
  }

  const progress = application.documentProgress;

  if (!progress || typeof progress !== "object") {
    return {
      ...DEFAULT_DOCUMENT_PROGRESS,
      missing: [],
    };
  }

  const required = Math.max(0, Number(progress.required || 0));

  const uploaded = Math.max(0, Number(progress.uploaded || 0));

  const approved = Math.max(0, Number(progress.approved || 0));

  const pending = Math.max(0, Number(progress.pending || 0));

  const rejected = Math.max(0, Number(progress.rejected || 0));

  /*
  ----------------------------------------------------------
  PERCENTAGE
  ----------------------------------------------------------
  */

  let percentage = Number(progress.percentage);

  if (!Number.isFinite(percentage)) {
    percentage = required > 0 ? (uploaded / required) * 100 : 0;
  }

  percentage = Math.max(0, Math.min(100, percentage));

  /*
  ----------------------------------------------------------
  COMPLETE
  ----------------------------------------------------------
  */

  const complete =
    Boolean(progress.complete) || (required > 0 && uploaded >= required);

  return {
    required,

    uploaded,

    approved,

    pending,

    rejected,

    missing: Array.isArray(progress.missing) ? progress.missing : [],

    percentage: Math.round(percentage),

    complete,
  };
};

/*
============================================================
DOCUMENT SUMMARY
============================================================

This is specifically for the overview dashboard.

Example:

{
  total: 5,
  uploaded: 4,
  approved: 2,
  pending: 1,
  rejected: 1,
  missing: 1
}

============================================================
*/

export const getDocumentSummary = (application) => {
  const documents = getDocumentProgress(application);

  const missing = Array.isArray(documents.missing)
    ? documents.missing.length
    : 0;

  return {
    total: documents.required,

    uploaded: documents.uploaded,

    approved: documents.approved,

    pending: documents.pending,

    rejected: documents.rejected,

    missing,

    percentage: documents.percentage,

    complete: documents.complete,
  };
};

/*
============================================================
APPLICATION PROGRESS
============================================================
*/

export const calculateProgress = (application) => {
  if (!application) {
    return 0;
  }

  const status = normalizeStatus(application.status);

  /*
  ----------------------------------------------------------
  TERMINAL
  ----------------------------------------------------------
  */

  if (status === "APPROVED") {
    return 100;
  }

  if (status === "REJECTED") {
    return 100;
  }

  /*
  ----------------------------------------------------------
  DOCUMENT REQUEST
  ----------------------------------------------------------

  Client has to provide additional documents.

  ----------------------------------------------------------
  */

  if (status === "DOCUMENT_REQUEST") {
    const documents = getDocumentProgress(application);

    if (documents.required > 0) {
      return Math.min(50, Math.round(documents.percentage / 2));
    }

    return 35;
  }

  /*
  ----------------------------------------------------------
  DOCUMENT STAGE
  ----------------------------------------------------------
  */

  const currentStep = String(application.currentStep || "")
    .trim()
    .toUpperCase();

  if (currentStep === "DOCUMENTS") {
    const documents = getDocumentProgress(application);

    if (documents.required > 0) {
      return Math.min(50, Math.round(documents.percentage / 2));
    }

    return status === "IN_PROGRESS" ? 10 : 0;
  }

  /*
  ----------------------------------------------------------
  REVIEW STEP
  ----------------------------------------------------------
  */

  if (currentStep === "REVIEW") {
    return 50;
  }

  /*
  ----------------------------------------------------------
  STEP INDEX
  ----------------------------------------------------------
  */

  const currentStepIndex = Number(application.currentStepIndex);

  if (
    Number.isFinite(currentStepIndex) &&
    currentStepIndex > 0 &&
    JOURNEY_STAGES.length > 1
  ) {
    const progress = (currentStepIndex / (JOURNEY_STAGES.length - 1)) * 100;

    return Math.round(Math.max(0, Math.min(95, progress)));
  }

  /*
  ----------------------------------------------------------
  STATUS FALLBACK
  ----------------------------------------------------------
  */

  const statusProgress = {
    DRAFT: 0,

    IN_PROGRESS: 10,

    SUBMITTED: 55,

    UNDER_REVIEW: 70,

    DOCUMENT_REQUEST: 40,

    PROCESSING: 85,

    APPROVED: 100,

    REJECTED: 100,
  };

  return statusProgress[status] ?? 0;
};

/*
============================================================
GET CURRENT JOURNEY INDEX
============================================================

Uses:

1. currentStep
2. backend status
3. currentStepIndex
4. status map fallback

============================================================
*/

export const getCurrentJourneyIndex = (application) => {
  if (!application) {
    return 0;
  }

  const status = normalizeStatus(application.status);

  const currentStep = String(application.currentStep || "")
    .trim()
    .toUpperCase();

  /*
  ----------------------------------------------------------
  CURRENT STEP
  ----------------------------------------------------------
  */

  if (currentStep) {
    const stepIndex = JOURNEY_STAGES.findIndex(
      (stage) =>
        String(stage.step || "")
          .trim()
          .toUpperCase() === currentStep,
    );

    if (stepIndex !== -1) {
      /*
       * For REVIEW, IN_PROGRESS may still mean
       * the client is finishing documents.
       *
       * Respect currentStep because it is the
       * most specific backend information.
       */

      return stepIndex;
    }
  }

  /*
  ----------------------------------------------------------
  STATUS MAP
  ----------------------------------------------------------
  */

  if (Object.prototype.hasOwnProperty.call(STATUS_STAGE_MAP, status)) {
    return STATUS_STAGE_MAP[status];
  }

  /*
  ----------------------------------------------------------
  STEP INDEX FALLBACK
  ----------------------------------------------------------
  */

  const index = Number(application.currentStepIndex);

  if (Number.isFinite(index) && index >= 0 && index < JOURNEY_STAGES.length) {
    return index;
  }

  return 0;
};

/*
============================================================
JOURNEY STAGES
============================================================
*/

export const getJourneyStages = (application) => {
  if (!application) {
    return [];
  }

  const status = normalizeStatus(application.status);

  const currentIndex = getCurrentJourneyIndex(application);

  return JOURNEY_STAGES.map((stage, index) => {
    let state = "upcoming";

    /*
      ------------------------------------------------------
      COMPLETED
      ------------------------------------------------------
      */

    if (index < currentIndex) {
      state = "completed";
    }

    /*
      ------------------------------------------------------
      CURRENT
      ------------------------------------------------------
      */

    if (index === currentIndex) {
      state = "current";
    }

    /*
      ------------------------------------------------------
      APPROVED
      ------------------------------------------------------

      Approved means the entire journey completed.

      ------------------------------------------------------
      */

    if (status === "APPROVED") {
      state = "completed";
    }

    /*
      ------------------------------------------------------
      REJECTED
      ------------------------------------------------------

      Rejected applications have reached the decision
      stage.

      ------------------------------------------------------
      */

    if (status === "REJECTED" && index < JOURNEY_STAGES.length - 1) {
      state = "completed";
    }

    if (status === "REJECTED" && index === JOURNEY_STAGES.length - 1) {
      state = "current";
    }

    return {
      ...stage,

      state,

      isCompleted: state === "completed",

      isCurrent: state === "current",

      isUpcoming: state === "upcoming",
    };
  });
};

/*
============================================================
CURRENT JOURNEY STAGE
============================================================
*/

export const getCurrentJourneyStage = (application) => {
  const stages = getJourneyStages(application);

  if (!stages.length) {
    return null;
  }

  return (
    stages.find((stage) => stage.state === "current") ||
    stages.find((stage) => stage.state === "upcoming") ||
    stages[stages.length - 1]
  );
};

/*
============================================================
APPLICATION STATE HELPERS
============================================================
*/

export const isDraftApplication = (application) => {
  return normalizeStatus(application?.status) === "DRAFT";
};

export const isInProgressApplication = (application) => {
  return ["IN_PROGRESS", "DOCUMENT_REQUEST"].includes(
    normalizeStatus(application?.status),
  );
};

export const isSubmittedApplication = (application) => {
  return ["SUBMITTED", "UNDER_REVIEW", "PROCESSING"].includes(
    normalizeStatus(application?.status),
  );
};

export const isCompletedApplication = (application) => {
  return TERMINAL_STATUSES.includes(normalizeStatus(application?.status));
};

export const isActiveApplication = (application) => {
  return ACTIVE_STATUSES.includes(normalizeStatus(application?.status));
};

/*
============================================================
APPLICATION PRIORITY
============================================================
*/

export const getApplicationPriority = (application) => {
  if (!application) {
    return Number.MAX_SAFE_INTEGER;
  }

  const status = normalizeStatus(application.status);

  const index = ACTIVE_APPLICATION_PRIORITY.indexOf(status);

  return index === -1 ? ACTIVE_APPLICATION_PRIORITY.length : index;
};

/*
============================================================
SELECT ACTIVE APPLICATION
============================================================

This is extremely important for clients with multiple
applications.

Priority:

1. Documents requiring attention
2. Client applications in progress
3. Draft applications
4. Applications under review
5. Processing
6. Submitted
7. Completed

Within the same status, the most recently updated
application wins.

============================================================
*/

export const getActiveApplication = (applications = []) => {
  if (!Array.isArray(applications)) {
    return null;
  }

  if (!applications.length) {
    return null;
  }

  const sorted = [...applications].sort((a, b) => {
    const priorityDifference =
      getApplicationPriority(a) - getApplicationPriority(b);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const aDate = new Date(a?.updatedAt || a?.createdAt || 0).getTime();

    const bDate = new Date(b?.updatedAt || b?.createdAt || 0).getTime();

    return bDate - aDate;
  });

  /*
  ----------------------------------------------------------
  Prefer an actual active application.
  ----------------------------------------------------------
  */

  const active = sorted.find((application) => isActiveApplication(application));

  if (active) {
    return active;
  }

  /*
  ----------------------------------------------------------
  Otherwise return the most recent application.
  ----------------------------------------------------------
  */

  return sorted[0] || null;
};

/*
============================================================
APPLICATION COUNTS
============================================================
*/

export const getApplicationCounts = (applications = []) => {
  if (!Array.isArray(applications)) {
    return {
      total: 0,

      active: 0,

      draft: 0,

      inProgress: 0,

      submitted: 0,

      underReview: 0,

      processing: 0,

      completed: 0,

      approved: 0,

      rejected: 0,
    };
  }

  const counts = {
    total: applications.length,

    active: 0,

    draft: 0,

    inProgress: 0,

    submitted: 0,

    underReview: 0,

    processing: 0,

    completed: 0,

    approved: 0,

    rejected: 0,
  };

  applications.forEach((application) => {
    const status = normalizeStatus(application?.status);

    if (isActiveApplication(application)) {
      counts.active += 1;
    }

    if (status === "DRAFT") {
      counts.draft += 1;
    }

    if (status === "IN_PROGRESS" || status === "DOCUMENT_REQUEST") {
      counts.inProgress += 1;
    }

    if (status === "SUBMITTED") {
      counts.submitted += 1;
    }

    if (status === "UNDER_REVIEW") {
      counts.underReview += 1;
    }

    if (status === "PROCESSING") {
      counts.processing += 1;
    }

    if (status === "APPROVED") {
      counts.approved += 1;
    }

    if (status === "REJECTED") {
      counts.rejected += 1;
    }

    if (TERMINAL_STATUSES.includes(status)) {
      counts.completed += 1;
    }
  });

  return counts;
};

/*
============================================================
NEXT ACTION
============================================================
*/

export const getNextAction = (application) => {
  if (!application) {
    return {
      title: "Start your application",

      description: "Begin your migration journey.",

      type: "START",

      urgent: false,
    };
  }

  const status = normalizeStatus(application.status);

  const documents = getDocumentProgress(application);

  /*
  ----------------------------------------------------------
  DRAFT
  ----------------------------------------------------------
  */

  if (status === "DRAFT") {
    return {
      title: "Start your application",

      description: "Begin completing your migration application.",

      type: "START",

      urgent: false,
    };
  }

  /*
  ----------------------------------------------------------
  DOCUMENT REQUEST
  ----------------------------------------------------------
  */

  if (status === "DOCUMENT_REQUEST") {
    return {
      title: "Upload requested documents",

      description:
        "Additional documents are required before your application can continue.",

      type: "DOCUMENTS",

      urgent: true,
    };
  }

  /*
  ----------------------------------------------------------
  REJECTED DOCUMENTS
  ----------------------------------------------------------
  */

  if (
    documents.rejected > 0 ||
    (Array.isArray(documents.missing) && documents.missing.length > 0)
  ) {
    return {
      title: "Review your documents",

      description:
        "Some documents need your attention before you can continue.",

      type: "DOCUMENT_REUPLOAD",

      urgent: true,
    };
  }

  /*
  ----------------------------------------------------------
  DOCUMENTS INCOMPLETE
  ----------------------------------------------------------
  */

  if (
    application.currentStep === "DOCUMENTS" &&
    documents.required > 0 &&
    !documents.complete
  ) {
    return {
      title: "Complete your documents",

      description: `${documents.uploaded} of ${documents.required} required documents uploaded.`,

      type: "DOCUMENTS",

      urgent: documents.required > documents.uploaded,
    };
  }

  /*
  ----------------------------------------------------------
  REVIEW
  ----------------------------------------------------------
  */

  if (application.currentStep === "REVIEW") {
    return {
      title: "Review your application",

      description: "Review your information and documents before submission.",

      type: "REVIEW",

      urgent: false,
    };
  }

  /*
  ----------------------------------------------------------
  SUBMITTED
  ----------------------------------------------------------
  */

  if (status === "SUBMITTED") {
    return {
      title: "Application submitted",

      description:
        "Your application has been successfully submitted to Colusus.",

      type: "SUBMITTED",

      urgent: false,
    };
  }

  /*
  ----------------------------------------------------------
  UNDER REVIEW
  ----------------------------------------------------------
  */

  if (status === "UNDER_REVIEW") {
    return {
      title: "Application under review",

      description: "The Colusus team is currently reviewing your application.",

      type: "REVIEW",

      urgent: false,
    };
  }

  /*
  ----------------------------------------------------------
  PROCESSING
  ----------------------------------------------------------
  */

  if (status === "PROCESSING") {
    return {
      title: "Application processing",

      description:
        "Your application is currently being processed by the Colusus team.",

      type: "PROCESSING",

      urgent: false,
    };
  }

  /*
  ----------------------------------------------------------
  APPROVED
  ----------------------------------------------------------
  */

  if (status === "APPROVED") {
    return {
      title: "Application approved",

      description:
        "Your migration application has reached a successful final decision.",

      type: "COMPLETED",

      urgent: false,
    };
  }

  /*
  ----------------------------------------------------------
  REJECTED
  ----------------------------------------------------------
  */

  if (status === "REJECTED") {
    return {
      title: "Application decision",

      description:
        "Your application has reached a final decision. Review the latest information from Colusus.",

      type: "COMPLETED",

      urgent: true,
    };
  }

  /*
  ----------------------------------------------------------
  DEFAULT
  ----------------------------------------------------------
  */

  return {
    title: "Continue your application",

    description: "Continue working through your migration journey.",

    type: "CONTINUE",

    urgent: false,
  };
};

/*
============================================================
APPLICATION SUMMARY
============================================================
*/

export const getApplicationSummary = (application) => {
  if (!application) {
    return {
      status: "DRAFT",

      statusConfig: getStatusConfig("DRAFT"),

      progress: 0,

      documents: getDocumentSummary(null),

      nextAction: getNextAction(null),

      currentStage: null,

      journeyStages: [],
    };
  }

  return {
    status: normalizeStatus(application.status),

    statusConfig: getStatusConfig(application.status),

    progress: calculateProgress(application),

    documents: getDocumentSummary(application),

    nextAction: getNextAction(application),

    currentStage: getCurrentJourneyStage(application),

    journeyStages: getJourneyStages(application),
  };
};

/*
============================================================
RECENT APPLICATIONS
============================================================
*/

export const getRecentApplications = (applications = [], limit = 4) => {
  if (!Array.isArray(applications)) {
    return [];
  }

  return [...applications]
    .sort((a, b) => {
      const aDate = new Date(a?.updatedAt || a?.createdAt || 0).getTime();

      const bDate = new Date(b?.updatedAt || b?.createdAt || 0).getTime();

      return bDate - aDate;
    })
    .slice(0, limit);
};

/*
============================================================
APPLICATION ACTIVITY
============================================================
*/

export const getApplicationActivity = (application, limit = 5) => {
  if (!application) {
    return [];
  }

  const activity = Array.isArray(application.activity)
    ? application.activity
    : [];

  return [...activity]
    .sort((a, b) => {
      const aDate = new Date(a?.createdAt || a?.date || 0).getTime();

      const bDate = new Date(b?.createdAt || b?.date || 0).getTime();

      return bDate - aDate;
    })
    .slice(0, limit);
};

/*
============================================================
GET USER
============================================================
*/

export const getUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("FAILED TO PARSE USER:", error);

    return null;
  }
};
