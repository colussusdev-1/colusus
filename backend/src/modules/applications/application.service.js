import Application from "./application.model.js";

import Opportunity from "../opportunities/opportunity.model.js";

import ClientProfile from "../client-profile/client-profile.model.js";

import Document from "../documents/document.model.js";

import notificationService from "../notifications/notification.service.js";

/*
============================================================
SUPPORTED APPLICATION TYPES
============================================================
*/

const APPLICATION_TYPES = Object.freeze([
  "STUDENT_VISA",
  "WORK_VISA",
  "TOURIST_VISA",
  "PERMANENT_RESIDENCE",
]);

/*
============================================================
DEFAULT APPLICATION JOURNEY
============================================================
*/

const APPLICATION_STEPS = Object.freeze(["DOCUMENTS", "REVIEW"]);

/*
============================================================
REQUIRED CLIENT PROFILE FIELDS
============================================================
*/

const REQUIRED_PROFILE_FIELDS = Object.freeze([
  "phoneNumber",
  "dateOfBirth",
  "nationality",
  "currentCountry",
  "address",
  "passportNumber",
]);

/*
============================================================
CLIENT EDITABLE STATUSES
============================================================
*/

const CLIENT_EDITABLE_STATUSES = Object.freeze(["DRAFT", "IN_PROGRESS"]);

/*
============================================================
CREATE APPLICATION
============================================================
*/

const createApplication = async (data) => {
  /*
  ----------------------------------------------------------
  AUTHENTICATION
  ----------------------------------------------------------
  */

  if (!data?.user) {
    const error = new Error(
      "Authenticated user is required to create an application.",
    );

    error.statusCode = 401;

    throw error;
  }

  /*
  ----------------------------------------------------------
  OPPORTUNITY
  ----------------------------------------------------------
  */

  if (!data?.opportunity) {
    const error = new Error(
      "A migration opportunity is required to start an application.",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  FIND ACTIVE OPPORTUNITY
  ----------------------------------------------------------
  */

  const opportunity = await Opportunity.findOne({
    _id: data.opportunity,

    active: true,
  });

  if (!opportunity) {
    const error = new Error("The selected opportunity is no longer available.");

    error.statusCode = 404;

    throw error;
  }

  /*
  ----------------------------------------------------------
  CLIENT PROFILE
  ----------------------------------------------------------
  */

  const clientProfile = await ClientProfile.findOne({
    user: data.user,
  }).lean();

  /*
  ----------------------------------------------------------
  MISSING PROFILE FIELDS
  ----------------------------------------------------------
  */

  const missingProfileFields = REQUIRED_PROFILE_FIELDS.filter((field) => {
    const value = clientProfile?.[field];

    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value === "string" && value.trim() === "") {
      return true;
    }

    return false;
  });

  /*
  ----------------------------------------------------------
  PROFILE COMPLETION
  ----------------------------------------------------------
  */

  const profileComplete =
    Boolean(clientProfile) && missingProfileFields.length === 0;

  const requiresProfileCompletion = !profileComplete;

  /*
  ----------------------------------------------------------
  APPLICATION TYPE
  ----------------------------------------------------------
  */

  const applicationType = deriveApplicationType(opportunity);

  if (!applicationType) {
    const error = new Error(
      "Unable to determine the application type for this pathway.",
    );

    error.statusCode = 400;

    throw error;
  }

  if (!APPLICATION_TYPES.includes(applicationType)) {
    const error = new Error(
      `Invalid application type generated: ${applicationType}`,
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  APPLICATION CONFIG
  ----------------------------------------------------------
  */

  const applicationConfig = opportunity.applicationConfig || {};

  /*
  ----------------------------------------------------------
  APPLICATION STEPS
  ----------------------------------------------------------
  */

  const applicationSteps = [...APPLICATION_STEPS];

  const initialStep = APPLICATION_STEPS[0];

  /*
  ----------------------------------------------------------
  WORKFLOW SNAPSHOT
  ----------------------------------------------------------
  */

  const workflow = Array.isArray(applicationConfig.workflow)
    ? applicationConfig.workflow.map((stage) => ({
        ...stage,

        status: stage?.status === "COMPLETED" ? "COMPLETED" : "PENDING",
      }))
    : [];

  /*
  ----------------------------------------------------------
  REQUIRED DOCUMENTS
  ----------------------------------------------------------
  */

  const requiredDocuments = Array.isArray(applicationConfig.requiredDocuments)
    ? applicationConfig.requiredDocuments
    : [];

  /*
  ----------------------------------------------------------
  OPPORTUNITY SNAPSHOT
  ----------------------------------------------------------
  */

  const opportunitySnapshot = {
    title: opportunity.title || "",

    countryName: opportunity.countryName || "",

    countrySlug: opportunity.countrySlug || "",

    countryFlag: opportunity.countryFlag || "",

    category: opportunity.category || "",

    type: opportunity.type || "",

    description: opportunity.description || "",

    applicationConfig: {
      steps: applicationSteps,

      questions: Array.isArray(applicationConfig.questions)
        ? applicationConfig.questions
        : [],

      requiredDocuments,

      workflow,
    },
  };

  /*
  ----------------------------------------------------------
  INITIAL DOCUMENT PROGRESS
  ----------------------------------------------------------
  */

  const requiredDocumentCount = requiredDocuments.filter(
    (document) => typeof document !== "object" || document.required !== false,
  ).length;

  const documentProgress = {
    required: requiredDocumentCount,

    uploaded: 0,

    approved: 0,

    pending: 0,

    rejected: 0,

    missing: requiredDocuments
      .filter(
        (document) =>
          typeof document !== "object" || document.required !== false,
      )
      .map((document) => getRequiredDocumentName(document)),

    percentage: requiredDocumentCount === 0 ? 100 : 0,

    complete: requiredDocumentCount === 0,
  };

  /*
  ----------------------------------------------------------
  APPLICATION DATA
  ----------------------------------------------------------
  */

  const applicationData = {
    user: data.user,

    opportunity: opportunity._id,

    opportunitySnapshot,

    type: applicationType,

    destinationCountry: data.destinationCountry || opportunity.countryName,

    status: "DRAFT",

    currentStep: initialStep,

    currentStepIndex: 0,

    answers: {},

    personalInformation: {},

    documentProgress,

    workflow,

    priority: data.priority || "MEDIUM",

    notes: data.notes || "",

    /*
    --------------------------------------------------------
    INITIAL ACTIVITY
    --------------------------------------------------------
    */

    activity: [
      {
        type: "CREATED",

        title: "Application created",

        description: "Your application was created successfully.",

        metadata: {
          status: "DRAFT",

          currentStep: initialStep,

          currentStepIndex: 0,
        },

        createdAt: new Date(),
      },
    ],
  };

  /*
  ----------------------------------------------------------
  CREATE
  ----------------------------------------------------------
  */

  const application = await Application.create(applicationData);

  /*
  ----------------------------------------------------------
  CLIENT NOTIFICATION
  ----------------------------------------------------------
  |
  | This is a meaningful event.
  |
  | We DO NOT notify for every draft field update.
  |
  ----------------------------------------------------------
  */

  try {
    await notificationService.createNotification({
      userId: data.user,

      type: "APPLICATION_CREATED",

      title: "Application started",

      message: `Your ${opportunity.title || "migration"} application for ${
        opportunity.countryName || "your selected destination"
      } has been created.`,

      entityType: "APPLICATION",

      entityId: application._id,

      metadata: {
        applicationId: application._id,

        opportunityId: opportunity._id,

        country: opportunity.countryName,

        status: "DRAFT",
      },

      priority: "NORMAL",
    });
  } catch (notificationError) {
    /*
    --------------------------------------------------------
    IMPORTANT
    --------------------------------------------------------
    |
    | A notification failure must NOT make application
    | creation fail.
    |
    | The application is the primary transaction.
    |
    --------------------------------------------------------
    */

    console.error(
      "FAILED TO CREATE APPLICATION NOTIFICATION:",
      notificationError,
    );
  }

  /*
  ----------------------------------------------------------
  POPULATE
  ----------------------------------------------------------
  */

  const populatedApplication = await Application.findById(
    application._id,
  ).populate("opportunity");

  return {
    application: populatedApplication,

    profileComplete,

    requiresProfileCompletion,

    missingProfileFields,
  };
};

/*
============================================================
UPDATE APPLICATION
============================================================
*/

const updateApplication = async (applicationId, userId, data = {}) => {
  /*
  ----------------------------------------------------------
  FIND APPLICATION
  ----------------------------------------------------------
  */

  const application = await Application.findOne({
    _id: applicationId,

    user: userId,
  });

  if (!application) {
    const error = new Error("Application not found.");

    error.statusCode = 404;

    throw error;
  }

  /*
  ----------------------------------------------------------
  PREVIOUS STATE
  ----------------------------------------------------------
  */

  const previousStatus = normalizeStatus(application.status);

  const previousStep = normalizeStep(application.currentStep);

  const previousStepIndex = Number(application.currentStepIndex || 0);

  const previousDocumentProgress = application.documentProgress || {};

  /*
  ----------------------------------------------------------
  CLIENT STATUS PROTECTION
  ----------------------------------------------------------
  */

  if (!CLIENT_EDITABLE_STATUSES.includes(previousStatus)) {
    const error = new Error(
      "This application is currently controlled by the Colusus review workflow.",
    );

    error.statusCode = 403;

    throw error;
  }

  /*
  ----------------------------------------------------------
  REQUESTED STATUS
  ----------------------------------------------------------
  */

  const requestedStatus =
    data.status !== undefined ? normalizeStatus(data.status) : previousStatus;

  /*
  ----------------------------------------------------------
  PREVENT STAFF STATUS CHANGES
  ----------------------------------------------------------
  */

  if (
    requestedStatus !== previousStatus &&
    !CLIENT_EDITABLE_STATUSES.includes(requestedStatus)
  ) {
    const error = new Error(
      "You cannot change the application to this status.",
    );

    error.statusCode = 403;

    throw error;
  }

  /*
  ----------------------------------------------------------
  REQUESTED STEP
  ----------------------------------------------------------
  */

  const requestedStep =
    data.currentStep !== undefined
      ? normalizeStep(data.currentStep)
      : previousStep;

  const requestedIndex =
    data.currentStepIndex !== undefined
      ? Number(data.currentStepIndex)
      : previousStepIndex;

  /*
  ----------------------------------------------------------
  VALIDATE INDEX
  ----------------------------------------------------------
  */

  if (!Number.isInteger(requestedIndex) || requestedIndex < 0) {
    const error = new Error("Invalid application step index.");

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  CONFIGURED STEPS
  ----------------------------------------------------------
  */

  const configuredSteps =
    Array.isArray(application?.opportunitySnapshot?.applicationConfig?.steps) &&
    application.opportunitySnapshot.applicationConfig.steps.length > 0
      ? application.opportunitySnapshot.applicationConfig.steps
      : APPLICATION_STEPS;

  const steps = configuredSteps.map(normalizeStep);

  /*
  ----------------------------------------------------------
  VALIDATE STEP
  ----------------------------------------------------------
  */

  if (requestedIndex >= steps.length) {
    const error = new Error("Application step does not exist.");

    error.statusCode = 400;

    throw error;
  }

  const actualStep = steps[requestedIndex];

  /*
  ----------------------------------------------------------
  PREVENT STEP MISMATCH
  ----------------------------------------------------------
  */

  if (requestedStep && requestedStep !== actualStep) {
    const error = new Error(
      "Application step does not match the configured journey.",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  CALCULATE DOCUMENT PROGRESS
  ----------------------------------------------------------
  */

  const documentProgress = await calculateDocumentProgress(application);

  /*
  ----------------------------------------------------------
  REVIEW REQUIREMENTS
  ----------------------------------------------------------
  */

  if (actualStep === "REVIEW" && !documentProgress.complete) {
    const error = new Error(
      "Complete all required documents before continuing to review.",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  CHANGE DETECTION
  ----------------------------------------------------------
  */

  const stepChanged =
    previousStep !== actualStep || previousStepIndex !== requestedIndex;

  const statusChanged = previousStatus !== requestedStatus;

  const personalInformationChanged = data.personalInformation !== undefined;

  const answersChanged = data.answers !== undefined;

  const notesChanged = data.notes !== undefined;

  /*
  ----------------------------------------------------------
  APPLY STATUS
  ----------------------------------------------------------
  */

  application.status = requestedStatus;

  /*
  ----------------------------------------------------------
  APPLY STEP
  ----------------------------------------------------------
  */

  application.currentStep = actualStep;

  application.currentStepIndex = requestedIndex;

  /*
  ----------------------------------------------------------
  PERSONAL INFORMATION
  ----------------------------------------------------------
  */

  if (personalInformationChanged) {
    application.personalInformation = data.personalInformation;
  }

  /*
  ----------------------------------------------------------
  ANSWERS
  ----------------------------------------------------------
  */

  if (answersChanged) {
    application.answers = data.answers;
  }

  /*
  ----------------------------------------------------------
  NOTES
  ----------------------------------------------------------
  */

  if (notesChanged) {
    application.notes = String(data.notes || "").trim();
  }

  /*
  ----------------------------------------------------------
  DOCUMENT PROGRESS
  ----------------------------------------------------------
  */

  application.documentProgress = documentProgress;

  /*
  ==========================================================
  ACTIVITY
  ==========================================================
  */

  /*
  ----------------------------------------------------------
  DRAFT → IN PROGRESS
  ----------------------------------------------------------
  */

  const shouldStartApplication =
    previousStatus === "DRAFT" &&
    (requestedStatus === "IN_PROGRESS" ||
      requestedIndex > 0 ||
      actualStep !== "DOCUMENTS" ||
      personalInformationChanged ||
      answersChanged ||
      notesChanged ||
      stepChanged);

  let applicationStarted = false;

  if (shouldStartApplication) {
    application.status = "IN_PROGRESS";

    const alreadyStarted = application.activity?.some(
      (activity) => normalizeActivityType(activity.type) === "STARTED",
    );

    if (!alreadyStarted) {
      application.activity.push({
        type: "STARTED",

        title: "Application started",

        description: "You have started completing your application.",

        metadata: {
          fromStatus: "DRAFT",

          toStatus: "IN_PROGRESS",

          currentStep: actualStep,

          currentStepIndex: requestedIndex,
        },

        createdAt: new Date(),
      });

      applicationStarted = true;
    }
  }

  /*
  ----------------------------------------------------------
  STATUS CHANGE
  ----------------------------------------------------------
  |
  | Client-side status changes are currently limited to
  | DRAFT → IN_PROGRESS.
  |
  | Staff-controlled status changes will be notified from
  | the staff/admin workflow when those endpoints are built.
  |
  ----------------------------------------------------------
  */

  if (
    statusChanged &&
    !(previousStatus === "DRAFT" && requestedStatus === "IN_PROGRESS")
  ) {
    application.activity.push({
      type: "STATUS_CHANGED",

      title: `Application status changed to ${formatStatusLabel(
        requestedStatus,
      )}`,

      description: `Your application status is now ${formatStatusLabel(
        requestedStatus,
      )}.`,

      metadata: {
        fromStatus: previousStatus,

        toStatus: requestedStatus,

        currentStep: actualStep,

        currentStepIndex: requestedIndex,
      },

      createdAt: new Date(),
    });
  }

  /*
  ----------------------------------------------------------
  STEP CHANGE
  ----------------------------------------------------------
  */

  if (stepChanged && previousStatus !== "DRAFT") {
    application.activity.push({
      type: "UPDATED",

      title: `Application moved to ${formatStepLabel(actualStep)}`,

      description: `Your application is now at the ${formatStepLabel(
        actualStep,
      )} stage.`,

      metadata: {
        previousStep,

        previousStepIndex,

        currentStep: actualStep,

        currentStepIndex: requestedIndex,
      },

      createdAt: new Date(),
    });
  }

  /*
  ----------------------------------------------------------
  DOCUMENTS COMPLETED
  ----------------------------------------------------------
  */

  const previouslyComplete = Boolean(previousDocumentProgress?.complete);

  const documentsNowComplete = Boolean(documentProgress.complete);

  const documentsJustCompleted =
    !previouslyComplete &&
    documentsNowComplete &&
    documentProgress.required > 0;

  if (documentsJustCompleted) {
    application.activity.push({
      type: "DOCUMENTS_COMPLETED",

      title: "Required documents completed",

      description:
        "All required documents for this application have been submitted.",

      metadata: {
        required: documentProgress.required,

        uploaded: documentProgress.uploaded,

        approved: documentProgress.approved,

        percentage: documentProgress.percentage,
      },

      createdAt: new Date(),
    });
  }

  /*
  ----------------------------------------------------------
  APPLICATION INFORMATION UPDATED
  ----------------------------------------------------------
  */

  const meaningfulInformationUpdate =
    (personalInformationChanged || answersChanged || notesChanged) &&
    previousStatus !== "DRAFT";

  if (meaningfulInformationUpdate) {
    application.activity.push({
      type: "UPDATED",

      title: "Application information updated",

      description:
        "Your application information has been updated successfully.",

      metadata: {
        currentStep: actualStep,

        currentStepIndex: requestedIndex,
      },

      createdAt: new Date(),
    });
  }

  /*
  ----------------------------------------------------------
  SAVE
  ----------------------------------------------------------
  */

  await application.save();

  /*
  ==========================================================
  NOTIFICATIONS
  ==========================================================
  |
  | Notification creation happens AFTER the application
  | has successfully saved.
  |
  | If notification creation fails, the application update
  | still succeeds.
  |
  ==========================================================
  */

  /*
  ----------------------------------------------------------
  APPLICATION STARTED
  ----------------------------------------------------------
  */

  if (applicationStarted) {
    try {
      await notificationService.createNotification({
        userId: userId,

        type: "APPLICATION_UPDATED",

        title: "Application started",

        message: "You have started completing your migration application.",

        entityType: "APPLICATION",

        entityId: application._id,

        metadata: {
          applicationId: application._id,

          status: "IN_PROGRESS",

          currentStep: actualStep,

          currentStepIndex: requestedIndex,
        },

        priority: "NORMAL",
      });
    } catch (notificationError) {
      console.error(
        "FAILED TO CREATE APPLICATION START NOTIFICATION:",
        notificationError,
      );
    }
  }

  /*
  ----------------------------------------------------------
  DOCUMENTS COMPLETED
  ----------------------------------------------------------
  */

  if (documentsJustCompleted) {
    try {
      await notificationService.createNotification({
        userId: userId,

        type: "APPLICATION_UPDATED",

        title: "Required documents completed",

        message:
          "All required documents for your application have been submitted.",

        entityType: "APPLICATION",

        entityId: application._id,

        metadata: {
          applicationId: application._id,

          required: documentProgress.required,

          uploaded: documentProgress.uploaded,

          approved: documentProgress.approved,

          percentage: documentProgress.percentage,
        },

        priority: "NORMAL",
      });
    } catch (notificationError) {
      console.error(
        "FAILED TO CREATE DOCUMENT COMPLETION NOTIFICATION:",
        notificationError,
      );
    }
  }

  /*
  ----------------------------------------------------------
  APPLICATION INFORMATION UPDATED
  ----------------------------------------------------------
  |
  | Only notify when the application has moved beyond the
  | initial draft stage.
  |
  ----------------------------------------------------------
  */

  if (meaningfulInformationUpdate) {
    try {
      await notificationService.createNotification({
        userId: userId,

        type: "APPLICATION_UPDATED",

        title: "Application information updated",

        message: "Your application information has been updated successfully.",

        entityType: "APPLICATION",

        entityId: application._id,

        metadata: {
          applicationId: application._id,

          currentStep: actualStep,

          currentStepIndex: requestedIndex,
        },

        priority: "LOW",
      });
    } catch (notificationError) {
      console.error(
        "FAILED TO CREATE APPLICATION UPDATE NOTIFICATION:",
        notificationError,
      );
    }
  }

  /*
  ----------------------------------------------------------
  RETURN
  ----------------------------------------------------------
  */

  const updatedApplication = await Application.findById(
    application._id,
  ).populate("opportunity");

  if (Array.isArray(updatedApplication?.activity)) {
    updatedApplication.activity = [...updatedApplication.activity].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  return updatedApplication;
};

/*
============================================================
CALCULATE DOCUMENT PROGRESS
============================================================
*/

const calculateDocumentProgress = async (application) => {
  const requiredDocuments =
    application?.opportunitySnapshot?.applicationConfig?.requiredDocuments;

  const requirements = Array.isArray(requiredDocuments)
    ? requiredDocuments
    : [];

  /*
    ----------------------------------------------------------
    NO REQUIREMENTS
    ----------------------------------------------------------
    */

  if (requirements.length === 0) {
    return {
      required: 0,

      uploaded: 0,

      approved: 0,

      pending: 0,

      rejected: 0,

      missing: [],

      percentage: 100,

      complete: true,
    };
  }

  /*
    ----------------------------------------------------------
    ACTUAL DOCUMENTS
    ----------------------------------------------------------
    */

  const uploadedDocuments = await Document.find({
    application: application._id,

    user: application.user,
  }).lean();

  /*
    ----------------------------------------------------------
    TRACK USED DOCUMENTS
    ----------------------------------------------------------
    */

  const usedDocuments = new Set();

  const missing = [];

  let uploadedCount = 0;

  let approvedCount = 0;

  let pendingCount = 0;

  let rejectedCount = 0;

  /*
    ----------------------------------------------------------
    MATCH REQUIREMENTS
    ----------------------------------------------------------
    */

  requirements.forEach((requirement) => {
    const requiredType = String(getRequiredDocumentType(requirement) || "")
      .trim()
      .toUpperCase();

    const requiredName = normalizeDocumentName(
      getRequiredDocumentName(requirement),
    );

    let matchedDocument = null;

    /*
        ------------------------------------------------------
        MATCH BY TYPE
        ------------------------------------------------------
        */

    if (requiredType && requiredType !== "OTHER") {
      matchedDocument = uploadedDocuments.find((document) => {
        const id = document?._id?.toString();

        if (id && usedDocuments.has(id)) {
          return false;
        }

        const documentType = String(
          document?.type || document?.documentType || "",
        )
          .trim()
          .toUpperCase();

        return documentType === requiredType;
      });
    }

    /*
        ------------------------------------------------------
        MATCH BY NAME
        ------------------------------------------------------
        */

    if (!matchedDocument && requiredName) {
      matchedDocument = uploadedDocuments.find((document) => {
        const id = document?._id?.toString();

        if (id && usedDocuments.has(id)) {
          return false;
        }

        const uploadedName = normalizeDocumentName(
          document?.name || document?.originalFileName || document?.type || "",
        );

        if (!uploadedName) {
          return false;
        }

        return (
          uploadedName === requiredName ||
          uploadedName.includes(requiredName) ||
          requiredName.includes(uploadedName)
        );
      });
    }

    /*
        ------------------------------------------------------
        MISSING
        ------------------------------------------------------
        */

    if (!matchedDocument) {
      if (typeof requirement !== "object" || requirement.required !== false) {
        missing.push(getRequiredDocumentName(requirement));
      }

      return;
    }

    /*
        ------------------------------------------------------
        MARK USED
        ------------------------------------------------------
        */

    const matchedId = matchedDocument?._id?.toString();

    if (matchedId) {
      usedDocuments.add(matchedId);
    }

    uploadedCount += 1;

    /*
        ------------------------------------------------------
        DOCUMENT STATUS
        ------------------------------------------------------
        */

    const documentStatus = normalizeStatus(matchedDocument.status);

    if (documentStatus === "APPROVED") {
      approvedCount += 1;
    } else if (
      documentStatus === "REJECTED" ||
      documentStatus === "REUPLOAD_REQUIRED"
    ) {
      rejectedCount += 1;
    } else {
      pendingCount += 1;
    }
  });

  /*
    ----------------------------------------------------------
    REQUIRED COUNT
    ----------------------------------------------------------
    */

  const requiredCount = requirements.filter(
    (requirement) =>
      typeof requirement !== "object" || requirement.required !== false,
  ).length;

  /*
    ----------------------------------------------------------
    PERCENTAGE
    ----------------------------------------------------------
    */

  const percentage =
    requiredCount > 0 ? Math.round((uploadedCount / requiredCount) * 100) : 100;

  return {
    required: requiredCount,

    uploaded: uploadedCount,

    approved: approvedCount,

    pending: pendingCount,

    rejected: rejectedCount,

    missing,

    percentage,

    complete: missing.length === 0,
  };
};

/*
============================================================
DERIVE APPLICATION TYPE
============================================================
*/

const deriveApplicationType = (opportunity) => {
  const searchableText = [
    opportunity?.title,

    opportunity?.type,

    opportunity?.category,

    opportunity?.countryVisa,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  /*
    ----------------------------------------------------------
    STUDENT
    ----------------------------------------------------------
    */

  if (
    searchableText.includes("student") ||
    searchableText.includes("study") ||
    searchableText.includes("education")
  ) {
    return "STUDENT_VISA";
  }

  /*
    ----------------------------------------------------------
    PERMANENT RESIDENCE
    ----------------------------------------------------------
    */

  if (
    searchableText.includes("permanent residence") ||
    searchableText.includes("permanent residency") ||
    searchableText.includes("residency") ||
    searchableText.includes("residence") ||
    searchableText.includes("settlement") ||
    searchableText.includes("skilled migration")
  ) {
    return "PERMANENT_RESIDENCE";
  }

  /*
    ----------------------------------------------------------
    TOURIST
    ----------------------------------------------------------
    */

  if (
    searchableText.includes("tourist") ||
    searchableText.includes("visitor") ||
    searchableText.includes("visit")
  ) {
    return "TOURIST_VISA";
  }

  /*
    ----------------------------------------------------------
    DEFAULT WORK
    ----------------------------------------------------------
    */

  return "WORK_VISA";
};

/*
============================================================
GET USER APPLICATIONS
============================================================
*/

const getUserApplications = async (userId) => {
  const applications = await Application.find({
    user: userId,
  })

    .populate("opportunity")

    .sort({
      createdAt: -1,
    });

  /*
    ----------------------------------------------------------
    REFRESH DOCUMENT PROGRESS
    ----------------------------------------------------------
    */

  for (const application of applications) {
    application.documentProgress = await calculateDocumentProgress(application);
  }

  return applications;
};

/*
============================================================
GET SINGLE APPLICATION
============================================================
*/

const getApplicationById = async (id, userId) => {
  const application = await Application.findOne({
    _id: id,

    user: userId,
  }).populate("opportunity");

  if (!application) {
    return null;
  }

  /*
    ----------------------------------------------------------
    REFRESH DOCUMENT PROGRESS
    ----------------------------------------------------------
    */

  application.documentProgress = await calculateDocumentProgress(application);

  /*
    ----------------------------------------------------------
    SORT ACTIVITY
    ----------------------------------------------------------
    */

  if (Array.isArray(application.activity)) {
    application.activity = [...application.activity].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  return application;
};

/*
============================================================
REQUIRED DOCUMENT NAME
============================================================
*/

const getRequiredDocumentName = (document) => {
  if (typeof document === "string") {
    return document;
  }

  return (
    document?.name ||
    document?.title ||
    document?.label ||
    document?.documentName ||
    document?.type ||
    "Required document"
  );
};

/*
============================================================
REQUIRED DOCUMENT TYPE
============================================================
*/

const getRequiredDocumentType = (document) => {
  if (typeof document === "string") {
    return "OTHER";
  }

  return document?.type || document?.documentType || "OTHER";
};

/*
============================================================
NORMALIZE DOCUMENT NAME
============================================================
*/

const normalizeDocumentName = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

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
NORMALIZE ACTIVITY TYPE
============================================================
*/

const normalizeActivityType = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/*
============================================================
NORMALIZE STEP
============================================================
*/

const normalizeStep = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/*
============================================================
FORMAT STEP LABEL
============================================================
*/

const formatStepLabel = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

/*
============================================================
FORMAT STATUS LABEL
============================================================
*/

const formatStatusLabel = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  createApplication,

  updateApplication,

  calculateDocumentProgress,

  getUserApplications,

  getApplicationById,
};
