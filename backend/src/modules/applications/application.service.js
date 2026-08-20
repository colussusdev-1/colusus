import Application from "./application.model.js";
import Opportunity from "../opportunities/opportunity.model.js";

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
CREATE APPLICATION
============================================================
*/

const createApplication = async (data) => {
  /*
  ------------------------------------------------------------
  VALIDATE REQUEST
  ------------------------------------------------------------
  */

  if (!data?.user) {
    const error = new Error(
      "Authenticated user is required to create an application.",
    );

    error.statusCode = 401;

    throw error;
  }

  if (!data?.opportunity) {
    const error = new Error(
      "A migration opportunity is required to start an application.",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  ------------------------------------------------------------
  FIND ACTIVE OPPORTUNITY
  ------------------------------------------------------------
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
  ------------------------------------------------------------
  DETERMINE APPLICATION TYPE
  ------------------------------------------------------------

  IMPORTANT:

  We DO NOT use data.type.

  The selected Opportunity determines the internal
  Application type.

  Example:

  Opportunity:
      type = "Standard Work Permit Package"

  Application:
      type = "WORK_VISA"
  */

  const applicationType = deriveApplicationType(opportunity);

  /*
  ------------------------------------------------------------
  HARD SAFETY CHECK
  ------------------------------------------------------------
  */

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
  ------------------------------------------------------------
  APPLICATION CONFIGURATION
  ------------------------------------------------------------
  */

  const applicationConfig = opportunity.applicationConfig || {};

  /*
  ------------------------------------------------------------
  APPLICATION STEPS
  ------------------------------------------------------------
  */

  const applicationSteps =
    Array.isArray(applicationConfig.steps) && applicationConfig.steps.length > 0
      ? applicationConfig.steps
      : ["PERSONAL_INFORMATION", "QUESTIONS", "DOCUMENTS", "REVIEW"];

  const initialStep = applicationSteps[0] || "PERSONAL_INFORMATION";

  /*
  ------------------------------------------------------------
  WORKFLOW SNAPSHOT
  ------------------------------------------------------------
  */

  const workflow = Array.isArray(applicationConfig.workflow)
    ? applicationConfig.workflow.map((stage) => ({
        ...stage,

        status: stage?.status === "COMPLETED" ? "COMPLETED" : "PENDING",
      }))
    : [];

  /*
  ------------------------------------------------------------
  OPPORTUNITY SNAPSHOT
  ------------------------------------------------------------
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

      requiredDocuments: Array.isArray(applicationConfig.requiredDocuments)
        ? applicationConfig.requiredDocuments
        : [],

      workflow,
    },
  };

  /*
  ------------------------------------------------------------
  CREATE APPLICATION
  ------------------------------------------------------------
  */

  const applicationData = {
    user: data.user,

    opportunity: opportunity._id,

    opportunitySnapshot,

    /*
     * THIS IS THE IMPORTANT VALUE
     */

    type: applicationType,

    destinationCountry: data.destinationCountry || opportunity.countryName,

    status: "DRAFT",

    currentStep: initialStep,

    currentStepIndex: 0,

    answers: {},

    personalInformation: {},

    documentProgress: {},

    workflow,

    priority: data.priority || "MEDIUM",

    notes: data.notes || "",
  };

  /*
  ------------------------------------------------------------
  DEBUG SAFETY LOG
  ------------------------------------------------------------

  This will appear in Render logs and prove exactly what
  the server is attempting to save.
  */

  console.log("CREATING APPLICATION:", {
    opportunityId: opportunity._id,

    opportunityTitle: opportunity.title,

    opportunityType: opportunity.type,

    opportunityCategory: opportunity.category,

    resolvedApplicationType: applicationType,
  });

  /*
  ------------------------------------------------------------
  CREATE
  ------------------------------------------------------------
  */

  const application = await Application.create(applicationData);

  /*
  ------------------------------------------------------------
  RETURN POPULATED APPLICATION
  ------------------------------------------------------------
  */

  return Application.findById(application._id).populate("opportunity");
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
  ------------------------------------------------------------
  STUDENT
  ------------------------------------------------------------
  */

  if (
    searchableText.includes("student") ||
    searchableText.includes("study") ||
    searchableText.includes("education")
  ) {
    return "STUDENT_VISA";
  }

  /*
  ------------------------------------------------------------
  PERMANENT RESIDENCE
  ------------------------------------------------------------
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
  ------------------------------------------------------------
  TOURIST / VISITOR
  ------------------------------------------------------------
  */

  if (
    searchableText.includes("tourist") ||
    searchableText.includes("visitor") ||
    searchableText.includes("visit")
  ) {
    return "TOURIST_VISA";
  }

  /*
  ------------------------------------------------------------
  WORK
  ------------------------------------------------------------

  Default migration pathway type.

  Examples:

  Standard Work Permit Package
  Skilled Worker
  Healthcare Worker
  Construction Worker
  Truck Driver
  Factory Worker
  Hospitality Worker
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

  return applications;
};

/*
============================================================
GET SINGLE APPLICATION
============================================================
*/

const getApplicationById = async (id, userId) => {
  return Application.findOne({
    _id: id,

    user: userId,
  }).populate("opportunity");
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  createApplication,

  getUserApplications,

  getApplicationById,
};
