import Document from "./document.model.js";
import Application from "../applications/application.model.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import notificationService from "../notifications/notification.service.js";

/*
============================================================
SUPPORTED DOCUMENT TYPES
============================================================
*/

const DOCUMENT_TYPES = [
  "PASSPORT",
  "IDENTIFICATION",
  "ACADEMIC_CERTIFICATE",
  "FINANCIAL_DOCUMENT",
  "EMPLOYMENT_DOCUMENT",
  "OTHER",
];

/*
============================================================
APPLICATION STATUS
============================================================
*/

const STATUS_DRAFT = "DRAFT";
const STATUS_IN_PROGRESS = "IN_PROGRESS";
const STATUS_UNDER_REVIEW = "UNDER_REVIEW";

/*
============================================================
DOCUMENT STATUS
============================================================
*/

const DOCUMENT_STATUS_UPLOADED = "UPLOADED";
const DOCUMENT_STATUS_UNDER_REVIEW = "UNDER_REVIEW";
const DOCUMENT_STATUS_APPROVED = "APPROVED";
const DOCUMENT_STATUS_REJECTED = "REJECTED";
const DOCUMENT_STATUS_REUPLOAD = "REUPLOAD_REQUIRED";

/*
============================================================
NORMALIZE STATUS
============================================================
*/

const normalizeStatus = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/*
============================================================
NORMALIZE DOCUMENT NAME
============================================================
*/

const normalizeDocumentName = (document) => {
  if (typeof document === "string") {
    return document.trim();
  }

  if (!document || typeof document !== "object") {
    return "";
  }

  return String(
    document.label || document.name || document.title || document.key || "",
  ).trim();
};

/*
============================================================
GET REQUIRED DOCUMENT TYPE
============================================================
*/

const getRequiredDocumentType = (document) => {
  if (!document || typeof document !== "object") {
    return null;
  }

  return document.type || document.documentType || null;
};

/*
============================================================
GET REQUIRED DOCUMENT DEFINITIONS
============================================================
*/

const getRequiredDocumentDefinitions = (application) => {
  const snapshotRequiredDocuments =
    application?.opportunitySnapshot?.applicationConfig?.requiredDocuments;

  if (
    Array.isArray(snapshotRequiredDocuments) &&
    snapshotRequiredDocuments.length > 0
  ) {
    return snapshotRequiredDocuments;
  }

  const opportunityRequiredDocuments =
    application?.opportunity?.applicationConfig?.requiredDocuments;

  if (
    Array.isArray(opportunityRequiredDocuments) &&
    opportunityRequiredDocuments.length > 0
  ) {
    return opportunityRequiredDocuments;
  }

  return [];
};

/*
============================================================
SAFE NOTIFICATION
============================================================

Notifications are secondary to the core operation.

If notification creation fails, document upload/status
processing must still succeed.

This prevents a notification problem from turning into:

DOCUMENT UPLOAD → 500 ERROR

============================================================
*/

const safeNotify = async (callback) => {
  try {
    await callback();
  } catch (error) {
    console.error(
      "[NOTIFICATION] Failed to create notification:",
      error?.message || error,
    );
  }
};

/*
============================================================
CALCULATE DOCUMENT PROGRESS
============================================================
*/

const calculateDocumentProgress = async (application) => {
  const requiredDefinitions = getRequiredDocumentDefinitions(application);

  const uploadedDocuments = await Document.find({
    application: application._id,
    user: application.user,
  }).sort({
    createdAt: 1,
  });

  /*
  ----------------------------------------------------------
  NO REQUIRED DOCUMENTS
  ----------------------------------------------------------
  */

  if (!requiredDefinitions.length) {
    return {
      required: 0,

      uploaded: uploadedDocuments.length,

      approved: uploadedDocuments.filter(
        (document) =>
          normalizeStatus(document.status) === DOCUMENT_STATUS_APPROVED,
      ).length,

      pending: uploadedDocuments.filter((document) => {
        const status = normalizeStatus(document.status);

        return (
          status === DOCUMENT_STATUS_UPLOADED ||
          status === DOCUMENT_STATUS_UNDER_REVIEW
        );
      }).length,

      rejected: uploadedDocuments.filter((document) => {
        const status = normalizeStatus(document.status);

        return (
          status === DOCUMENT_STATUS_REJECTED ||
          status === DOCUMENT_STATUS_REUPLOAD
        );
      }).length,

      missing: [],

      percentage: 100,

      complete: true,

      documents: uploadedDocuments,
    };
  }

  /*
  ----------------------------------------------------------
  NORMALIZE REQUIREMENTS
  ----------------------------------------------------------
  */

  const requiredDocuments = requiredDefinitions
    .map((document) => ({
      name: normalizeDocumentName(document),

      required:
        typeof document === "object" ? document.required !== false : true,

      type: getRequiredDocumentType(document),

      key: typeof document === "object" ? document.key || null : null,
    }))
    .filter((document) => document.name);

  /*
  ----------------------------------------------------------
  MATCH DOCUMENTS
  ----------------------------------------------------------
  */

  const missing = [];
  const matchedDocuments = [];

  for (const requiredDocument of requiredDocuments) {
    const requiredName = requiredDocument.name.trim().toLowerCase();

    const requiredType = normalizeStatus(requiredDocument.type);

    let matchingDocument = null;

    /*
    --------------------------------------------------------
    FIND BY TYPE FIRST
    --------------------------------------------------------
    */

    if (requiredType) {
      matchingDocument = uploadedDocuments.find(
        (document) => normalizeStatus(document.type) === requiredType,
      );
    }

    /*
    --------------------------------------------------------
    FALLBACK TO NAME
    --------------------------------------------------------
    */

    if (!matchingDocument) {
      matchingDocument = uploadedDocuments.find((document) => {
        const uploadedName = String(
          document.name || document.originalFileName || "",
        )
          .trim()
          .toLowerCase();

        return (
          uploadedName === requiredName ||
          uploadedName.includes(requiredName) ||
          requiredName.includes(uploadedName)
        );
      });
    }

    /*
    --------------------------------------------------------
    MISSING
    --------------------------------------------------------
    */

    if (!matchingDocument) {
      if (requiredDocument.required !== false) {
        missing.push({
          key: requiredDocument.key || requiredDocument.name,

          name: requiredDocument.name,

          type: requiredDocument.type,

          required: requiredDocument.required,
        });
      }

      continue;
    }

    matchedDocuments.push({
      required: requiredDocument,

      uploaded: matchingDocument,
    });
  }

  /*
  ----------------------------------------------------------
  COUNTS
  ----------------------------------------------------------
  */

  const requiredCount = requiredDocuments.filter(
    (document) => document.required !== false,
  ).length;

  const uploadedCount = matchedDocuments.filter(({ required, uploaded }) => {
    if (required.required === false) {
      return true;
    }

    const status = normalizeStatus(uploaded.status);

    return (
      status !== DOCUMENT_STATUS_REJECTED && status !== DOCUMENT_STATUS_REUPLOAD
    );
  }).length;

  const approvedCount = uploadedDocuments.filter(
    (document) => normalizeStatus(document.status) === DOCUMENT_STATUS_APPROVED,
  ).length;

  const pendingCount = uploadedDocuments.filter((document) => {
    const status = normalizeStatus(document.status);

    return (
      status === DOCUMENT_STATUS_UPLOADED ||
      status === DOCUMENT_STATUS_UNDER_REVIEW
    );
  }).length;

  const rejectedCount = uploadedDocuments.filter((document) => {
    const status = normalizeStatus(document.status);

    return (
      status === DOCUMENT_STATUS_REJECTED || status === DOCUMENT_STATUS_REUPLOAD
    );
  }).length;

  /*
  ----------------------------------------------------------
  PERCENTAGE
  ----------------------------------------------------------
  */

  const percentage =
    requiredCount > 0 ? Math.round((uploadedCount / requiredCount) * 100) : 100;

  /*
  ----------------------------------------------------------
  COMPLETE
  ----------------------------------------------------------
  */

  const complete = missing.length === 0 && uploadedCount >= requiredCount;

  return {
    required: requiredCount,

    uploaded: uploadedCount,

    approved: approvedCount,

    pending: pendingCount,

    rejected: rejectedCount,

    missing,

    percentage,

    complete,

    documents: uploadedDocuments,
  };
};

/*
============================================================
ADD APPLICATION ACTIVITY
============================================================
*/

const addApplicationActivity = (
  application,
  { type, title, description, metadata = {} },
) => {
  if (!application || !Array.isArray(application.activity)) {
    return;
  }

  application.activity.push({
    type,

    title,

    description,

    metadata,

    createdAt: new Date(),
  });
};

/*
============================================================
UPDATE APPLICATION DOCUMENT PROGRESS
============================================================
*/

const updateApplicationDocumentProgress = async (
  application,
  { documentEvent = null, document = null } = {},
) => {
  const previousStatus = normalizeStatus(application.status);

  const previousComplete = Boolean(application?.documentProgress?.complete);

  const previousStep = application.currentStep || "DOCUMENTS";

  /*
    --------------------------------------------------------
    CALCULATE CURRENT PROGRESS
    --------------------------------------------------------
    */

  const progress = await calculateDocumentProgress(application);

  /*
    --------------------------------------------------------
    DETERMINE APPLICATION STATUS
    --------------------------------------------------------
    */

  let nextStatus = previousStatus;

  const protectedStatuses = ["APPROVED", "REJECTED", "PROCESSING"];

  if (!protectedStatuses.includes(previousStatus)) {
    if (progress.complete) {
      nextStatus = STATUS_UNDER_REVIEW;
    } else if (progress.uploaded > 0) {
      nextStatus = STATUS_IN_PROGRESS;
    } else {
      nextStatus = STATUS_DRAFT;
    }
  }

  /*
    --------------------------------------------------------
    DETERMINE APPLICATION STEP
    --------------------------------------------------------
    */

  const nextStep = progress.complete ? "REVIEW" : "DOCUMENTS";

  const nextStepIndex = progress.complete ? 1 : 0;

  /*
    --------------------------------------------------------
    APPLICATION STARTED
    --------------------------------------------------------
    */

  if (previousStatus === STATUS_DRAFT && progress.uploaded > 0) {
    addApplicationActivity(application, {
      type: "STARTED",

      title: "Application started",

      description:
        "Your application is now in progress as you begin submitting the required documents.",

      metadata: {
        fromStatus: previousStatus,

        toStatus: STATUS_IN_PROGRESS,
      },
    });
  }

  /*
    --------------------------------------------------------
    DOCUMENT ACTIVITY
    --------------------------------------------------------
    */

  if (documentEvent && document) {
    const eventMap = {
      DOCUMENT_UPLOADED: {
        title: "Document uploaded",

        description: `${document.name} was successfully uploaded to your application.`,
      },

      DOCUMENT_REVIEW: {
        title: "Document under review",

        description: `${document.name} is currently being reviewed by the Colusus team.`,
      },

      DOCUMENT_APPROVED: {
        title: "Document approved",

        description: `${document.name} has been approved.`,
      },

      DOCUMENT_REJECTED: {
        title: "Document rejected",

        description: `${document.name} was rejected and requires attention.`,
      },

      DOCUMENT_REUPLOAD_REQUIRED: {
        title: "Document re-upload required",

        description: `${document.name} needs to be uploaded again.`,
      },
    };

    const event = eventMap[documentEvent];

    if (event) {
      addApplicationActivity(application, {
        type: documentEvent,

        title: event.title,

        description: event.description,

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,

          documentStatus: document.status,

          reviewNote: document.reviewNote || "",
        },
      });
    }
  }

  /*
    --------------------------------------------------------
    ALL DOCUMENTS COMPLETED
    --------------------------------------------------------
    */

  const documentsJustCompleted =
    !previousComplete && progress.complete && progress.required > 0;

  if (documentsJustCompleted) {
    addApplicationActivity(application, {
      type: "DOCUMENTS_COMPLETED",

      title: "Required documents completed",

      description:
        "All required documents for this application have been submitted.",

      metadata: {
        required: progress.required,

        uploaded: progress.uploaded,

        approved: progress.approved,
      },
    });
  }

  /*
    --------------------------------------------------------
    APPLICATION MOVED TO REVIEW
    --------------------------------------------------------
    */

  const movedToReview =
    previousStatus !== STATUS_UNDER_REVIEW &&
    nextStatus === STATUS_UNDER_REVIEW;

  if (movedToReview) {
    addApplicationActivity(application, {
      type: "STATUS_CHANGED",

      title: "Application moved to review",

      description:
        "All required documents have been submitted. Your application is now ready for Colusus review.",

      metadata: {
        fromStatus: previousStatus,

        toStatus: nextStatus,

        fromStep: previousStep,

        toStep: nextStep,
      },
    });
  }

  /*
    --------------------------------------------------------
    SAVE APPLICATION
    --------------------------------------------------------
    */

  application.status = nextStatus;

  application.currentStep = nextStep;

  application.currentStepIndex = nextStepIndex;

  application.documentProgress = {
    required: progress.required,

    uploaded: progress.uploaded,

    approved: progress.approved,

    pending: progress.pending,

    rejected: progress.rejected,

    missing: progress.missing,

    percentage: progress.percentage,

    complete: progress.complete,

    lastCalculatedAt: new Date(),
  };

  await application.save();

  /*
    ========================================================
    NOTIFICATIONS
    ========================================================
    */

  /*
    --------------------------------------------------------
    CLIENT DOCUMENT NOTIFICATION
    --------------------------------------------------------
    */

  if (documentEvent === "DOCUMENT_APPROVED") {
    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Document approved",

        message: `${document.name} has been approved by the Colusus team.`,

        type: "DOCUMENT_APPROVED",

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,
        },
      }),
    );
  }

  /*
    --------------------------------------------------------
    CLIENT DOCUMENT REJECTED
    --------------------------------------------------------
    */

  if (documentEvent === "DOCUMENT_REJECTED") {
    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Document rejected",

        message: `${document.name} was rejected. Please review the feedback and update the document.`,

        type: "DOCUMENT_REJECTED",

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,

          reviewNote: document.reviewNote || "",
        },
      }),
    );
  }

  /*
    --------------------------------------------------------
    CLIENT RE-UPLOAD REQUIRED
    --------------------------------------------------------
    */

  if (documentEvent === "DOCUMENT_REUPLOAD_REQUIRED") {
    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Document re-upload required",

        message: `${document.name} needs to be uploaded again before your application can continue.`,

        type: "DOCUMENT_REUPLOAD",

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,

          reviewNote: document.reviewNote || "",
        },
      }),
    );
  }

  /*
    --------------------------------------------------------
    APPLICATION READY FOR REVIEW
    --------------------------------------------------------
    */

  if (documentsJustCompleted) {
    /*
      CLIENT
      */

    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Documents completed",

        message:
          "All required documents have been submitted. Your application is now ready for review.",

        type: "APPLICATION_UPDATE",

        metadata: {
          applicationId: application._id,

          event: "DOCUMENTS_COMPLETED",
        },
      }),
    );

    /*
      STAFF + ADMIN
      */

    await safeNotify(() =>
      notificationService.createForRoles({
        roles: ["ADMIN", "STAFF"],

        title: "Application ready for review",

        message:
          "A client has completed all required documents and the application is ready for review.",

        type: "APPLICATION_UPDATE",

        metadata: {
          applicationId: application._id,

          clientId: application.user,

          event: "DOCUMENTS_COMPLETED",
        },
      }),
    );
  }

  /*
    --------------------------------------------------------
    APPLICATION MOVED TO REVIEW
    --------------------------------------------------------
    */

  if (movedToReview) {
    await safeNotify(() =>
      notificationService.createForRoles({
        roles: ["ADMIN", "STAFF"],

        title: "Application moved to review",

        message:
          "A client application has completed its required documents and is ready for staff review.",

        type: "APPLICATION_STATUS_CHANGED",

        metadata: {
          applicationId: application._id,

          clientId: application.user,

          fromStatus: previousStatus,

          toStatus: nextStatus,
        },
      }),
    );
  }

  /*
    --------------------------------------------------------
    RETURN
    --------------------------------------------------------
    */

  return {
    application,

    progress,
  };
};

/*
============================================================
CREATE / UPLOAD DOCUMENT
============================================================
*/

const createDocument = async ({ userId, applicationId, name, type, file }) => {
  /*
  ----------------------------------------------------------
  VALIDATE FILE
  ----------------------------------------------------------
  */

  if (!file) {
    const error = new Error("Document file is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  VALIDATE APPLICATION
  ----------------------------------------------------------
  */

  if (!applicationId) {
    const error = new Error("Application ID is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  VALIDATE NAME
  ----------------------------------------------------------
  */

  if (!name || String(name).trim() === "") {
    const error = new Error("Document name is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  VALIDATE TYPE
  ----------------------------------------------------------
  */

  if (!DOCUMENT_TYPES.includes(type)) {
    const error = new Error(`Invalid document type: ${type}.`);

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  VERIFY APPLICATION OWNERSHIP
  ----------------------------------------------------------
  */

  const application = await Application.findOne({
    _id: applicationId,

    user: userId,
  }).populate("opportunity");

  if (!application) {
    const error = new Error("Application not found.");

    error.statusCode = 404;

    throw error;
  }

  /*
  ----------------------------------------------------------
  BLOCK TERMINAL APPLICATIONS
  ----------------------------------------------------------
  */

  const applicationStatus = normalizeStatus(application.status);

  if (applicationStatus === "APPROVED" || applicationStatus === "REJECTED") {
    const error = new Error(
      "Documents can no longer be uploaded for this application.",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  UPLOAD TO CLOUDINARY
  ----------------------------------------------------------
  */

  const cloudinaryResult = await uploadToCloudinary(file.buffer, {
    folder: `colusus/documents/${applicationId}`,
  });

  /*
  ----------------------------------------------------------
  CREATE DOCUMENT
  ----------------------------------------------------------
  */

  const document = await Document.create({
    user: userId,

    application: applicationId,

    name: String(name).trim(),

    type,

    fileUrl: cloudinaryResult?.secure_url || "",

    cloudinaryPublicId: cloudinaryResult?.public_id || "",

    originalFileName: file.originalname || "",

    mimeType: file.mimetype || "",

    fileSize: file.size || 0,

    status: DOCUMENT_STATUS_UPLOADED,
  });

  /*
  ==========================================================
  NOTIFY OPERATIONS
  ==========================================================
  */

  await safeNotify(() =>
    notificationService.createForRoles({
      roles: ["ADMIN", "STAFF"],

      title: "New document uploaded",

      message: `A client uploaded ${document.name} to an application.`,

      type: "APPLICATION_UPDATE",

      metadata: {
        applicationId: application._id,

        documentId: document._id,

        clientId: application.user,

        documentName: document.name,

        documentType: document.type,

        event: "DOCUMENT_UPLOADED",
      },
    }),
  );

  /*
  ----------------------------------------------------------
  UPDATE APPLICATION
  ----------------------------------------------------------
  */

  const result = await updateApplicationDocumentProgress(application, {
    documentEvent: "DOCUMENT_UPLOADED",

    document,
  });

  /*
  ----------------------------------------------------------
  RETURN
  ----------------------------------------------------------
  */

  return {
    document,

    application: result.application,

    progress: result.progress,
  };
};

/*
============================================================
GET ALL CLIENT DOCUMENTS
============================================================
*/

const getUserDocuments = async (userId) => {
  return Document.find({
    user: userId,
  })
    .populate("application", "type destinationCountry status")
    .sort({
      createdAt: -1,
    });
};

/*
============================================================
GET APPLICATION DOCUMENTS
============================================================
*/

const getApplicationDocuments = async (applicationId, userId) => {
  const application = await Application.findOne({
    _id: applicationId,

    user: userId,
  });

  if (!application) {
    const error = new Error("Application not found.");

    error.statusCode = 404;

    throw error;
  }

  return Document.find({
    application: applicationId,

    user: userId,
  }).sort({
    createdAt: -1,
  });
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================
*/

const getDocumentById = async (documentId, userId) => {
  const document = await Document.findOne({
    _id: documentId,

    user: userId,
  });

  if (!document) {
    const error = new Error("Document not found.");

    error.statusCode = 404;

    throw error;
  }

  const application = await Application.findOne({
    _id: document.application,

    user: userId,
  });

  if (!application) {
    const error = new Error("Document application not found.");

    error.statusCode = 404;

    throw error;
  }

  return document;
};

/*
============================================================
CLIENT DOCUMENT UPDATE
============================================================
*/

const updateDocumentStatus = async (documentId, userId, data = {}) => {
  const document = await Document.findOne({
    _id: documentId,

    user: userId,
  });

  if (!document) {
    return null;
  }

  /*
    --------------------------------------------------------
    CLIENT CAN ONLY UPDATE NAME
    --------------------------------------------------------
    */

  if (data.name !== undefined) {
    document.name = String(data.name).trim();
  }

  /*
    --------------------------------------------------------
    BLOCK STATUS MANIPULATION
    --------------------------------------------------------
    */

  if (data.status !== undefined) {
    const requestedStatus = normalizeStatus(data.status);

    const currentStatus = normalizeStatus(document.status);

    if (requestedStatus !== currentStatus) {
      const error = new Error(
        "Document review status can only be changed by the Colusus team.",
      );

      error.statusCode = 403;

      throw error;
    }
  }

  await document.save();

  /*
    --------------------------------------------------------
    RECALCULATE APPLICATION
    --------------------------------------------------------
    */

  const application = await Application.findOne({
    _id: document.application,

    user: userId,
  }).populate("opportunity");

  if (application) {
    await updateApplicationDocumentProgress(application);
  }

  return document;
};

/*
============================================================
STAFF DOCUMENT STATUS UPDATE
============================================================
*/

const updateDocumentStatusByStaff = async (
  documentId,
  data = {},
  staffUserId = null,
) => {
  const allowedStatuses = [
    DOCUMENT_STATUS_UPLOADED,

    DOCUMENT_STATUS_UNDER_REVIEW,

    DOCUMENT_STATUS_APPROVED,

    DOCUMENT_STATUS_REJECTED,

    DOCUMENT_STATUS_REUPLOAD,
  ];

  const nextStatus = normalizeStatus(data.status);

  if (!allowedStatuses.includes(nextStatus)) {
    const error = new Error("Invalid document review status.");

    error.statusCode = 400;

    throw error;
  }

  /*
    ----------------------------------------------------------
    FIND DOCUMENT
    ----------------------------------------------------------
    */

  const document = await Document.findById(documentId);

  if (!document) {
    const error = new Error("Document not found.");

    error.statusCode = 404;

    throw error;
  }

  /*
    ----------------------------------------------------------
    PREVIOUS STATUS
    ----------------------------------------------------------
    */

  const previousStatus = normalizeStatus(document.status);

  /*
    ----------------------------------------------------------
    UPDATE DOCUMENT
    ----------------------------------------------------------
    */

  document.status = nextStatus;

  if (data.reviewNote !== undefined) {
    document.reviewNote = String(data.reviewNote || "").trim();
  }

  if (
    nextStatus === DOCUMENT_STATUS_APPROVED ||
    nextStatus === DOCUMENT_STATUS_REJECTED ||
    nextStatus === DOCUMENT_STATUS_REUPLOAD ||
    nextStatus === DOCUMENT_STATUS_UNDER_REVIEW
  ) {
    document.reviewedBy = staffUserId || null;

    document.reviewedAt = new Date();
  }

  await document.save();

  /*
    ----------------------------------------------------------
    FIND APPLICATION
    ----------------------------------------------------------
    */

  const application = await Application.findById(document.application).populate(
    "opportunity",
  );

  if (!application) {
    return {
      document,

      application: null,

      progress: null,
    };
  }

  /*
    ----------------------------------------------------------
    MAP ACTIVITY
    ----------------------------------------------------------
    */

  let activityType = null;

  switch (nextStatus) {
    case DOCUMENT_STATUS_UNDER_REVIEW:
      activityType = "DOCUMENT_REVIEW";
      break;

    case DOCUMENT_STATUS_APPROVED:
      activityType = "DOCUMENT_APPROVED";
      break;

    case DOCUMENT_STATUS_REJECTED:
      activityType = "DOCUMENT_REJECTED";
      break;

    case DOCUMENT_STATUS_REUPLOAD:
      activityType = "DOCUMENT_REUPLOAD_REQUIRED";
      break;

    default:
      activityType = null;
  }

  /*
    ----------------------------------------------------------
    UPDATE APPLICATION
    ----------------------------------------------------------
    */

  const result = await updateApplicationDocumentProgress(application, {
    documentEvent: activityType,

    document,
  });

  /*
    ----------------------------------------------------------
    GENERIC STATUS CHANGE
    ----------------------------------------------------------
    */

  if (previousStatus !== nextStatus && !activityType) {
    addApplicationActivity(application, {
      type: "STATUS_CHANGED",

      title: "Document status updated",

      description: `${document.name} status was updated.`,

      metadata: {
        documentId: document._id,

        previousStatus,

        nextStatus,

        reviewedBy: staffUserId,
      },
    });

    await application.save();
  }

  /*
    ==========================================================
    STAFF → CLIENT NOTIFICATIONS
    ==========================================================
    */

  /*
    ----------------------------------------------------------
    UNDER REVIEW
    ----------------------------------------------------------
    */

  if (activityType === "DOCUMENT_REVIEW") {
    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Document under review",

        message: `${document.name} is now being reviewed by the Colusus team.`,

        type: "APPLICATION_UPDATE",

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,

          status: nextStatus,
        },
      }),
    );
  }

  /*
    ----------------------------------------------------------
    APPROVED
    ----------------------------------------------------------
    */

  if (activityType === "DOCUMENT_APPROVED") {
    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Document approved",

        message: `${document.name} has been approved.`,

        type: "DOCUMENT_APPROVED",

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,

          status: nextStatus,
        },
      }),
    );
  }

  /*
    ----------------------------------------------------------
    REJECTED
    ----------------------------------------------------------
    */

  if (activityType === "DOCUMENT_REJECTED") {
    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Document rejected",

        message: `${document.name} was rejected. Please review the feedback provided by the Colusus team.`,

        type: "DOCUMENT_REJECTED",

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,

          status: nextStatus,

          reviewNote: document.reviewNote || "",
        },
      }),
    );
  }

  /*
    ----------------------------------------------------------
    RE-UPLOAD REQUIRED
    ----------------------------------------------------------
    */

  if (activityType === "DOCUMENT_REUPLOAD_REQUIRED") {
    await safeNotify(() =>
      notificationService.createForApplicationOwner({
        application,

        title: "Document re-upload required",

        message: `${document.name} needs to be uploaded again before your application can continue.`,

        type: "DOCUMENT_REUPLOAD",

        metadata: {
          documentId: document._id,

          documentName: document.name,

          documentType: document.type,

          status: nextStatus,

          reviewNote: document.reviewNote || "",
        },
      }),
    );
  }

  /*
    ----------------------------------------------------------
    STAFF/ADMIN ACTIVITY
    ----------------------------------------------------------
    */

  if (previousStatus !== nextStatus) {
    await safeNotify(() =>
      notificationService.createForRoles({
        roles: ["ADMIN", "STAFF"],

        title: "Document status updated",

        message: `${document.name} was updated to ${nextStatus.replace(
          /_/g,
          " ",
        )}.`,

        type: "APPLICATION_UPDATE",

        metadata: {
          applicationId: application._id,

          documentId: document._id,

          clientId: application.user,

          previousStatus,

          nextStatus,

          updatedBy: staffUserId,
        },
      }),
    );
  }

  /*
    ----------------------------------------------------------
    RETURN
    ----------------------------------------------------------
    */

  return {
    document,

    application: result.application,

    progress: result.progress,
  };
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  createDocument,

  getUserDocuments,

  getApplicationDocuments,

  getDocumentById,

  updateDocumentStatus,

  updateDocumentStatusByStaff,

  calculateDocumentProgress,

  updateApplicationDocumentProgress,
};
