import api from "./api";

/*
============================================================
APPLICATION SERVICE
============================================================
|
| Handles all client-side API communication for applications.
|
| Responsibilities:
|
| - Get all applications
| - Get a single application
| - Check profile completion
| - Create an application
| - Persist application journey progress
| - Persist document progress
|
| IMPORTANT:
|
| The backend controls staff/application workflow statuses.
|
| The client can trigger:
|
| DRAFT → IN_PROGRESS
|
| The client cannot directly set:
|
| SUBMITTED
| UNDER_REVIEW
| DOCUMENT_REQUEST
| PROCESSING
| APPROVED
| REJECTED
|
============================================================
*/

/*
============================================================
GET USER APPLICATIONS
============================================================
*/

const getApplications = async () => {
  const { data } = await api.get("/applications");

  return data.data;
};

/*
============================================================
GET SINGLE APPLICATION
============================================================
*/

const getApplication = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const { data } = await api.get(`/applications/${applicationId}`);

  return data.data;
};

/*
============================================================
CHECK PROFILE COMPLETION
============================================================
|
| GET /api/v1/client-profile/completion
|
| Expected response:
|
| {
|   success: true,
|   data: {
|     exists: false,
|     isComplete: false,
|     percentage: 0,
|     missingFields: []
|   }
| }
|
============================================================
*/

const getProfileCompletion = async () => {
  const { data } = await api.get("/client-profile/completion");

  return data.data;
};

/*
============================================================
CREATE APPLICATION
============================================================
|
| Creates a new application from an opportunity.
|
| Backend default:
|
| status:
|   DRAFT
|
| currentStep:
|   DOCUMENTS
|
| currentStepIndex:
|   0
|
============================================================
*/

const createApplication = async (applicationData) => {
  if (!applicationData || typeof applicationData !== "object") {
    throw new Error("Application data is required.");
  }

  const { data } = await api.post("/applications", applicationData);

  return data.data;
};

/*
============================================================
UPDATE APPLICATION
============================================================
|
| Persists client-owned application progress.
|
| Supported fields currently handled by the backend:
|
| - currentStep
| - currentStepIndex
| - personalInformation
| - answers
| - notes
|
| The backend automatically determines when:
|
| DRAFT → IN_PROGRESS
|
| Do NOT send status from the client.
|
============================================================
*/

const updateApplication = async (applicationId, updateData) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!updateData || typeof updateData !== "object") {
    throw new Error("Application update data is required.");
  }

  const { data } = await api.patch(
    `/applications/${applicationId}`,
    updateData,
  );

  return data.data;
};

/*
============================================================
UPDATE APPLICATION STEP
============================================================
|
| Moves the client through the configured application
| journey.
|
| Example:
|
| DOCUMENTS
|   index: 0
|
| REVIEW
|   index: 1
|
| The backend determines whether the application should
| transition from DRAFT to IN_PROGRESS.
|
============================================================
*/

const updateApplicationStep = async (
  applicationId,
  currentStep,
  currentStepIndex = 0,
) => {
  if (!currentStep) {
    throw new Error("Application step is required.");
  }

  return updateApplication(applicationId, {
    currentStep,

    currentStepIndex,
  });
};

/*
============================================================
START APPLICATION
============================================================
|
| This intentionally does not send:
|
| status: "IN_PROGRESS"
|
| because the backend owns that transition.
|
| We simply persist the first meaningful client action.
|
| For the default journey this means:
|
| DOCUMENTS → index 0
|
| The backend sees that the client has started progressing
| and changes:
|
| DRAFT → IN_PROGRESS
|
============================================================
*/

const startApplication = async (applicationId) => {
  return updateApplication(applicationId, {
    currentStep: "DOCUMENTS",

    currentStepIndex: 0,
  });
};

/*
============================================================
UPDATE APPLICATION ANSWERS
============================================================
|
| Used when pathway-specific questions are eventually
| enabled.
|
============================================================
*/

const updateApplicationAnswers = async (applicationId, answers) => {
  return updateApplication(applicationId, {
    answers,
  });
};

/*
============================================================
UPDATE PERSONAL INFORMATION
============================================================
|
| Kept for backwards compatibility.
|
| The primary personal information source is ClientProfile,
| but the application backend still supports this field.
|
============================================================
*/

const updatePersonalInformation = async (
  applicationId,
  personalInformation,
) => {
  return updateApplication(applicationId, {
    personalInformation,
  });
};

/*
============================================================
UPDATE APPLICATION NOTES
============================================================
*/

const updateApplicationNotes = async (applicationId, notes) => {
  return updateApplication(applicationId, {
    notes,
  });
};

/*
============================================================
UPDATE DOCUMENT PROGRESS
============================================================
|
| The backend calculates document progress from the actual
| Document collection when an application is fetched or
| updated.
|
| Therefore this helper is mainly useful if we want to
| explicitly persist a calculated progress snapshot.
|
| ApplicationCompletion should normally refresh the
| application instead of trusting a frontend calculation.
|
============================================================
*/

const updateDocumentProgress = async (applicationId, documentProgress) => {
  if (!documentProgress) {
    throw new Error("Document progress is required.");
  }

  return updateApplication(applicationId, {
    documentProgress,
  });
};

/*
============================================================
REFRESH APPLICATION
============================================================
|
| Convenience helper.
|
| Useful after:
|
| - Document upload
| - Document re-upload
| - Document review
| - Moving between application stages
|
| The backend recalculates documentProgress from MongoDB.
|
============================================================
*/

const refreshApplication = async (applicationId) => {
  return getApplication(applicationId);
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

  getApplications,

  getApplication,

  refreshApplication,

  /*
  | Profile
  */

  getProfileCompletion,

  /*
  | Application creation
  */

  createApplication,

  /*
  | Application progress
  */

  updateApplication,

  updateApplicationStep,

  startApplication,

  /*
  | Application data
  */

  updateApplicationAnswers,

  updatePersonalInformation,

  updateApplicationNotes,

  /*
  | Document progress
  */

  updateDocumentProgress,
};
