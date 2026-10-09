import Application from "./application.model.js";
import ApplicationCounter from "./application.counter.model.js";
import Opportunity from "../opportunities/opportunity.model.js";
import ClientProfile from "../client-profile/client-profile.model.js";
import Document from "../documents/document.model.js";

import {
  applicationCreated,
  notifyUser,
} from "../notifications/notification.policy.js";

import invoiceService from "../finance/invoices/invoice.service.js";

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
PAYMENT TYPES
============================================================
*/

const APPLICATION_PAYMENT_TYPE = "APPLICATION";

/*
============================================================
CREATE APPLICATION REFERENCE
============================================================
*/

const createApplicationReference = (year, sequence) => {
  if (!year) {
    throw new Error(
      "Application year is required to generate application reference.",
    );
  }

  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error(
      "A valid application sequence is required to generate application reference.",
    );
  }

  return `COL-${year}-${String(sequence).padStart(6, "0")}`;
};

/*
============================================================
GET NEXT APPLICATION SEQUENCE
============================================================
*/

const getNextApplicationSequence = async () => {
  const year = new Date().getFullYear();

  const counter = await ApplicationCounter.findOneAndUpdate(
    {
      year,
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  if (!counter) {
    throw new Error("Unable to generate the application sequence number.");
  }

  return {
    year,
    sequence: counter.sequence,
  };
};

/*
============================================================
NORMALIZE PAYMENT AMOUNT
============================================================
*/

const normalizePaymentAmount = (value) => {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) {
      return null;
    }

    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replace(/₦/gi, "")
    .replace(/NGN/gi, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .trim();

  if (!normalized) {
    return null;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return amount;
};

/*
============================================================
NORMALIZE PAYMENT PLAN
============================================================
*/

const normalizePaymentPlan = (paymentPlan) => {
  if (!Array.isArray(paymentPlan)) {
    return [];
  }

  return paymentPlan
    .map((stage, index) => {
      const amount = normalizePaymentAmount(stage?.amount);

      if (!amount || amount <= 0) {
        return null;
      }

      const stageNumber = index + 1;

      const name =
        String(
          stage?.stage ||
            stage?.name ||
            stage?.title ||
            `Payment Stage ${stageNumber}`,
        ).trim() || `Payment Stage ${stageNumber}`;

      return {
        stage: stageNumber,
        name,
        amount,
        currency: String(stage?.currency || stage?.currencyCode || "NGN")
          .trim()
          .toUpperCase(),
        status: stageNumber === 1 ? "PENDING" : "LOCKED",
        invoiceId: null,
        paidAt: null,
      };
    })
    .filter(Boolean);
};

/*
============================================================
GET CUSTOMER SNAPSHOT
============================================================
*/

const getCustomerSnapshot = async (application) => {
  const populatedApplication = await Application.findById(
    application._id,
  ).populate({
    path: "user",
    select: "firstName lastName name email phone phoneNumber",
  });

  const user = populatedApplication?.user;

  if (!user) {
    const error = new Error("Unable to resolve the application customer.");
    error.statusCode = 400;
    throw error;
  }

  const customerName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  const customerEmail = String(user.email || "").trim();
  const customerPhone = user.phone || user.phoneNumber || null;

  if (!customerName) {
    const error = new Error(
      "Customer name is required before an application payment can be created.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!customerEmail) {
    const error = new Error(
      "Customer email is required before an application payment can be created.",
    );
    error.statusCode = 400;
    throw error;
  }

  return {
    id: user._id,
    name: customerName,
    email: customerEmail,
    phone: customerPhone,
  };
};

/*
============================================================
GET NEXT PAYABLE STAGE
============================================================
*/

const getNextPayableStage = (application) => {
  return application.paymentPlan?.find(
    (stage) =>
      ["PENDING"].includes(stage.status) &&
      !stage.invoiceId &&
      Number(stage.amount) > 0,
  );
};

/*
============================================================
CREATE STAGE INVOICE
============================================================
*/

const createApplicationStageInvoice = async (application, stage) => {
  if (!application?._id) {
    throw new Error("Application is required to create a payment invoice.");
  }

  if (!stage) {
    return null;
  }

  if (stage.invoiceId) {
    const existingInvoice = await invoiceService.getInvoiceById(
      stage.invoiceId,
    );

    if (existingInvoice) {
      return existingInvoice;
    }
  }

  const customer = await getCustomerSnapshot(application);

  const invoice = await invoiceService.createInvoice({
    invoiceType: APPLICATION_PAYMENT_TYPE,
    customer,

    items: [
      {
        name: stage.name,
        description: `Application payment stage ${stage.stage} for ${application.applicationReference}.`,
        quantity: 1,
        unitPrice: stage.amount,
        total: stage.amount,
      },
    ],

    currency: stage.currency || "NGN",
    discount: 0,

    context: {
      applicationId: application._id,
      applicationReference: application.applicationReference,
      opportunityId: application.opportunity,
      paymentStage: stage.stage,
      paymentStageName: stage.name,
    },

    notes: `Application payment stage ${stage.stage}: ${stage.name}`,

    metadata: {
      source: "APPLICATION",
      applicationId: application._id.toString(),
      applicationReference: application.applicationReference,
      opportunityId: application.opportunity.toString(),
      paymentStage: stage.stage,
    },
  });

  const issuedInvoice = await invoiceService.issueInvoice(invoice._id);

  return issuedInvoice;
};

/*
============================================================
CREATE INITIAL APPLICATION INVOICE
============================================================
*/

const createInitialApplicationInvoice = async (application) => {
  const firstStage = application.paymentPlan?.find(
    (stage) => Number(stage.stage) === 1 && stage.status === "PENDING",
  );

  if (!firstStage) {
    return null;
  }

  const invoice = await createApplicationStageInvoice(application, firstStage);

  firstStage.invoiceId = invoice._id;
  firstStage.status = "PENDING";

  application.paymentStatus = "PAYMENT_PENDING";
  application.currentPaymentStage = firstStage.stage;

  return invoice;
};

/*
============================================================
COMPLETE APPLICATION PAYMENT STAGE
============================================================

Finance confirms the payment and marks the invoice PAID.
This function advances the application payment plan.

It does not verify Paystack transactions itself.
============================================================
*/

const completeApplicationPaymentStage = async ({
  applicationId,
  invoice,
  payment = null,
}) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!invoice?._id) {
    throw new Error("A paid application invoice is required.");
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    const error = new Error("Application not found.");
    error.statusCode = 404;
    throw error;
  }

  const invoiceStage = Number(
    invoice?.context?.paymentStage || invoice?.metadata?.paymentStage || 0,
  );

  if (!Number.isInteger(invoiceStage) || invoiceStage < 1) {
    const error = new Error(
      "The application payment invoice does not contain a valid payment stage.",
    );
    error.statusCode = 400;
    throw error;
  }

  const currentStage = application.paymentPlan?.find(
    (stage) => Number(stage.stage) === invoiceStage,
  );

  if (!currentStage) {
    const error = new Error(
      `Payment stage ${invoiceStage} does not exist on this application.`,
    );
    error.statusCode = 400;
    throw error;
  }

  /*
  ----------------------------------------------------------
  VERIFY INVOICE OWNERSHIP
  ----------------------------------------------------------
  */

  if (
    invoice.context?.applicationId &&
    String(invoice.context.applicationId) !== String(application._id)
  ) {
    const error = new Error(
      "The payment invoice does not belong to this application.",
    );
    error.statusCode = 403;
    throw error;
  }

  /*
  ----------------------------------------------------------
  IDEMPOTENCY
  ----------------------------------------------------------
  */

  if (currentStage.status === "PAID") {
    const nextStage = application.paymentPlan?.find(
      (stage) =>
        Number(stage.stage) === invoiceStage + 1 && stage.status !== "PAID",
    );

    return {
      application,
      invoice,
      payment,
      stage: currentStage,
      nextStage: nextStage || null,
      alreadyCompleted: true,
    };
  }

  /*
  ----------------------------------------------------------
  MARK CURRENT STAGE PAID
  ----------------------------------------------------------
  */

  currentStage.status = "PAID";
  currentStage.invoiceId = invoice._id;
  currentStage.paidAt = invoice.paidAt || new Date();

  /*
  ----------------------------------------------------------
  FIND NEXT STAGE
  ----------------------------------------------------------
  */

  const nextStage = application.paymentPlan?.find(
    (stage) => Number(stage.stage) === invoiceStage + 1,
  );

  /*
  ----------------------------------------------------------
  FINAL PAYMENT
  ----------------------------------------------------------
  */

  if (!nextStage) {
    application.paymentStatus = "PAID";
    application.currentPaymentStage = null;

    application.activity.push({
      type: "UPDATED",
      title: "Application payments completed",
      description:
        "All required payment stages for this application have been paid.",

      metadata: {
        applicationId: application._id,
        applicationReference: application.applicationReference,
        paymentStage: invoiceStage,
        invoiceId: invoice._id,
        paymentReference: payment?.reference || null,
        paymentStatus: "PAID",
      },

      createdAt: new Date(),
    });

    await application.save();

    return {
      application,
      invoice,
      payment,
      stage: currentStage,
      nextStage: null,
      nextInvoice: null,
      alreadyCompleted: false,
    };
  }

  /*
  ----------------------------------------------------------
  ACTIVATE NEXT PAYMENT STAGE
  ----------------------------------------------------------
  */

  nextStage.status = "PENDING";
  application.currentPaymentStage = nextStage.stage;
  application.paymentStatus = "PAYMENT_PENDING";

  const nextInvoice = await createApplicationStageInvoice(
    application,
    nextStage,
  );

  if (nextInvoice?._id) {
    nextStage.invoiceId = nextInvoice._id;
  }

  application.activity.push({
    type: "UPDATED",
    title: "Payment stage completed",
    description: `${currentStage.name} has been paid. ${nextStage.name} is now available.`,

    metadata: {
      applicationId: application._id,
      applicationReference: application.applicationReference,
      completedStage: currentStage.stage,
      nextStage: nextStage.stage,
      invoiceId: invoice._id,
      nextInvoiceId: nextInvoice?._id || null,
      paymentReference: payment?.reference || null,
    },

    createdAt: new Date(),
  });

  await application.save();

  /*
  ----------------------------------------------------------
  NOTIFY CLIENT OF NEXT PAYMENT STAGE
  ----------------------------------------------------------
  */

  try {
    await notifyUser({
      user: application.user,
      role: "CLIENT",
      actor: null,
      category: "PAYMENT",
      type: "PENDING",
      title: "Next payment stage available",
      message: `${currentStage.name} has been completed. Your next payment stage, ${nextStage.name}, is now available.`,
      priority: "HIGH",
      application: application._id,
      entityType: "APPLICATION",
      entityId: application._id,
      action: "PAY",
      actionUrl: "/portal/finance",

      metadata: {
        applicationReference: application.applicationReference,
        completedStage: currentStage.stage,
        nextStage: nextStage.stage,
        invoiceId: nextInvoice?._id || null,
        amount: nextStage.amount,
        currency: nextStage.currency || "NGN",
        paymentReference: payment?.reference || null,
      },
    });
  } catch (notificationError) {
    console.error(
      "[APPLICATION PAYMENT] Failed to create next-stage notification:",
      notificationError.message,
    );
  }

  return {
    application,
    invoice,
    payment,
    stage: currentStage,
    nextStage,
    nextInvoice,
    alreadyCompleted: false,
  };
};
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
  ==========================================================
  PAYMENT PLAN SNAPSHOT
  ==========================================================
  */

  const paymentPlan = normalizePaymentPlan(opportunity.paymentPlan);

  /*
  ----------------------------------------------------------
  PAYMENT STATE
  ----------------------------------------------------------
  */

  const hasPaymentPlan = paymentPlan.length > 0;

  const paymentStatus = hasPaymentPlan ? "PAYMENT_PENDING" : "NOT_REQUIRED";

  const currentPaymentStage = hasPaymentPlan ? paymentPlan[0].stage : null;

  /*
  ==========================================================
  PERMANENT APPLICATION REFERENCE
  ==========================================================
  */

  const { year: applicationYear, sequence: applicationSequence } =
    await getNextApplicationSequence();

  /*
  ----------------------------------------------------------
  APPLICATION REFERENCE
  ----------------------------------------------------------
  */

  const applicationReference = createApplicationReference(
    applicationYear,
    applicationSequence,
  );

  /*
  ----------------------------------------------------------
  APPLICATION DATA
  ----------------------------------------------------------
  */

  const applicationData = {
    user: data.user,

    opportunity: opportunity._id,

    opportunitySnapshot,

    applicationReference,

    type: applicationType,

    destinationCountry: data.destinationCountry || opportunity.countryName,

    status: "DRAFT",

    paymentStatus,

    currentPaymentStage,

    paymentPlan,

    currentStep: initialStep,

    currentStepIndex: 0,

    answers: {},

    personalInformation: {},

    documentProgress,

    workflow,

    priority: data.priority || "MEDIUM",

    notes: data.notes || "",

    activity: [
      {
        type: "CREATED",

        title: "Application created",

        description: "Your application was created successfully.",

        metadata: {
          applicationReference,
          applicationYear,
          applicationSequence,
          status: "DRAFT",
          currentStep: initialStep,
          currentStepIndex: 0,
          paymentStatus,
          currentPaymentStage,
        },

        createdAt: new Date(),
      },
    ],
  };

  /*
  ----------------------------------------------------------
  CREATE APPLICATION
  ----------------------------------------------------------
  */

  const application = await Application.create(applicationData);

  /*
  ==========================================================
  CREATE INITIAL FINANCE INVOICE
  ==========================================================
  */

  let initialInvoice = null;

  try {
    if (hasPaymentPlan) {
      initialInvoice = await createInitialApplicationInvoice(application);

      if (initialInvoice) {
        application.activity.push({
          type: "UPDATED",

          title: "Initial application payment created",

          description: "Your first application payment invoice is ready.",

          metadata: {
            applicationReference,
            paymentStage: currentPaymentStage,
            invoiceId: initialInvoice._id,
            invoiceNumber: initialInvoice.invoiceNumber,
            amount: initialInvoice.total,
            currency: initialInvoice.currency,
            paymentStatus: "PAYMENT_PENDING",
          },

          createdAt: new Date(),
        });

        await application.save();
      }
    }
  } catch (financeError) {
    /*
    --------------------------------------------------------
    ROLLBACK APPLICATION
    --------------------------------------------------------
    */

    try {
      await Application.deleteOne({
        _id: application._id,
      });
    } catch (rollbackError) {
      console.error(
        "FAILED TO ROLLBACK APPLICATION AFTER FINANCE ERROR:",
        rollbackError,
      );
    }

    console.error(
      "FAILED TO CREATE INITIAL APPLICATION FINANCE INVOICE:",
      financeError,
    );

    throw financeError;
  }

  /*
  ----------------------------------------------------------
  CLIENT NOTIFICATION
  ----------------------------------------------------------
  */

  try {
    await applicationCreated({
      application,
      actor: data.user,
      client: data.user,
    });
  } catch (notificationError) {
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

  /*
  ----------------------------------------------------------
  RETURN
  ----------------------------------------------------------
  */

  return {
    application: populatedApplication,
    profileComplete,
    requiresProfileCompletion,
    missingProfileFields,
    invoice: initialInvoice,
  };
};
/*
============================================================
UPDATE APPLICATION
============================================================
*/

const updateApplication = async (applicationId, userId, data = {}) => {
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
      "This application is currently controlled by the colossus review workflow.",
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
          applicationId: application._id,
          applicationReference: application.applicationReference,
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
        applicationId: application._id,
        applicationReference: application.applicationReference,
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
        applicationId: application._id,
        applicationReference: application.applicationReference,
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
        applicationId: application._id,
        applicationReference: application.applicationReference,
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
        applicationId: application._id,
        applicationReference: application.applicationReference,
        currentStep: actualStep,
        currentStepIndex: requestedIndex,
      },

      createdAt: new Date(),
    });
  }

  /*
  ----------------------------------------------------------
  SAVE APPLICATION
  ----------------------------------------------------------
  */

  await application.save();

  /*
  ==========================================================
  NOTIFICATIONS
  ==========================================================
  */

  /*
  ----------------------------------------------------------
  APPLICATION STARTED
  ----------------------------------------------------------
  */

  if (applicationStarted) {
    try {
      await notifyUser({
        user: userId,
        role: "CLIENT",
        actor: userId,
        category: "APPLICATION",
        type: "UPDATED",
        title: "Application started",
        message: "You have started completing your migration application.",
        priority: "NORMAL",
        application: application._id,
        entityType: "APPLICATION",
        entityId: application._id,
        action: "VIEW",
        actionUrl: `/portal/applications/${application._id}`,

        metadata: {
          applicationId: application._id,
          applicationReference: application.applicationReference,
          status: "IN_PROGRESS",
          currentStep: actualStep,
          currentStepIndex: requestedIndex,
        },
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
      await notifyUser({
        user: userId,
        role: "CLIENT",
        actor: userId,
        category: "APPLICATION",
        type: "UPDATED",
        title: "Required documents completed",
        message:
          "All required documents for your application have been submitted.",
        priority: "NORMAL",
        application: application._id,
        entityType: "APPLICATION",
        entityId: application._id,
        action: "VIEW",
        actionUrl: `/portal/applications/${application._id}`,

        metadata: {
          applicationId: application._id,
          applicationReference: application.applicationReference,
          required: documentProgress.required,
          uploaded: documentProgress.uploaded,
          approved: documentProgress.approved,
          percentage: documentProgress.percentage,
        },
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
  */

  if (meaningfulInformationUpdate) {
    try {
      await notifyUser({
        user: userId,
        role: "CLIENT",
        actor: userId,
        category: "APPLICATION",
        type: "UPDATED",
        title: "Application information updated",
        message: "Your application information has been updated successfully.",
        priority: "LOW",
        application: application._id,
        entityType: "APPLICATION",
        entityId: application._id,
        action: "VIEW",
        actionUrl: `/portal/applications/${application._id}`,

        metadata: {
          applicationId: application._id,
          applicationReference: application.applicationReference,
          currentStep: actualStep,
          currentStepIndex: requestedIndex,
        },
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

  const uploadedDocuments = await Document.find({
    application: application._id,
    user: application.user,
  }).lean();

  const usedDocuments = new Set();
  const missing = [];

  let uploadedCount = 0;
  let approvedCount = 0;
  let pendingCount = 0;
  let rejectedCount = 0;

  requirements.forEach((requirement) => {
    const requiredType = String(getRequiredDocumentType(requirement) || "")
      .trim()
      .toUpperCase();

    const requiredName = normalizeDocumentName(
      getRequiredDocumentName(requirement),
    );

    let matchedDocument = null;

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

    if (!matchedDocument) {
      if (typeof requirement !== "object" || requirement.required !== false) {
        missing.push(getRequiredDocumentName(requirement));
      }

      return;
    }

    const matchedId = matchedDocument?._id?.toString();

    if (matchedId) {
      usedDocuments.add(matchedId);
    }

    uploadedCount += 1;

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

  const requiredCount = requirements.filter(
    (requirement) =>
      typeof requirement !== "object" || requirement.required !== false,
  ).length;

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

  if (
    searchableText.includes("student") ||
    searchableText.includes("study") ||
    searchableText.includes("education")
  ) {
    return "STUDENT_VISA";
  }

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

  if (
    searchableText.includes("tourist") ||
    searchableText.includes("visitor") ||
    searchableText.includes("visit")
  ) {
    return "TOURIST_VISA";
  }

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

  application.documentProgress = await calculateDocumentProgress(application);

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
  completeApplicationPaymentStage,
  calculateDocumentProgress,
  getUserApplications,
  getApplicationById,
};
