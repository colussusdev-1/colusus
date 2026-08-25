import Opportunity from "../modules/opportunities/opportunity.model.js";

/*
|--------------------------------------------------------------------------
| COUNTRY DATA
|--------------------------------------------------------------------------
*/

import australia from "./data/australia.js";
import bulgaria from "./data/bulgaria.js";
import canada from "./data/canada.js";
import croatia from "./data/croatia.js";
import finland from "./data/finland.js";
import germany from "./data/germany.js";
import hungary from "./data/hungary.js";
import latvia from "./data/latvia.js";
import lithuania from "./data/lithuania.js";
import norway from "./data/norway.js";
import poland from "./data/poland.js";
import romania from "./data/romania.js";
import serbia from "./data/serbia.js";
import spain from "./data/spain.js";
import uk from "./data/uk.js";

/*
|--------------------------------------------------------------------------
| ALL COUNTRIES
|--------------------------------------------------------------------------
*/

const countries = [
  australia,
  bulgaria,
  canada,
  croatia,
  finland,
  germany,
  hungary,
  latvia,
  lithuania,
  norway,
  poland,
  romania,
  serbia,
  spain,
  uk,
];

/*
|--------------------------------------------------------------------------
| DEFAULT APPLICATION WORKFLOW
|--------------------------------------------------------------------------
|
| The client-facing application journey is:
|
| DOCUMENTS → REVIEW
|
| Personal information is completed through Client Profile
| before an application is started.
|
*/

const DEFAULT_APPLICATION_STEPS = ["DOCUMENTS", "REVIEW"];

/*
|--------------------------------------------------------------------------
| DEFAULT INTERNAL WORKFLOW
|--------------------------------------------------------------------------
*/

const buildDefaultWorkflow = () => {
  return [
    {
      key: "APPLICATION_SUBMITTED",

      label: "Application Submitted",

      status: "PENDING",

      order: 1,
    },

    {
      key: "DOCUMENT_REVIEW",

      label: "Document Review",

      status: "PENDING",

      order: 2,
    },

    {
      key: "PROCESSING",

      label: "Application Processing",

      status: "PENDING",

      order: 3,
    },

    {
      key: "FINAL_DECISION",

      label: "Final Decision",

      status: "PENDING",

      order: 4,
    },
  ];
};

/*
|--------------------------------------------------------------------------
| DOCUMENT TYPE RESOLVER
|--------------------------------------------------------------------------
|
| Converts the public document name into one of the document
| types supported by the Document model.
|
| IMPORTANT:
| We NEVER use "FILE".
|
|--------------------------------------------------------------------------
*/

const resolveDocumentType = (documentName) => {
  const normalizedName = String(documentName || "")
    .trim()
    .toLowerCase();

  if (normalizedName.includes("passport")) {
    return "PASSPORT";
  }

  if (
    normalizedName.includes("identification") ||
    normalizedName.includes("identity") ||
    normalizedName.includes("national id") ||
    normalizedName.includes("id card")
  ) {
    return "IDENTIFICATION";
  }

  if (
    normalizedName.includes("academic") ||
    normalizedName.includes("certificate") ||
    normalizedName.includes("degree") ||
    normalizedName.includes("diploma") ||
    normalizedName.includes("transcript")
  ) {
    return "ACADEMIC_CERTIFICATE";
  }

  if (
    normalizedName.includes("financial") ||
    normalizedName.includes("bank") ||
    normalizedName.includes("statement") ||
    normalizedName.includes("funds") ||
    normalizedName.includes("proof of funds")
  ) {
    return "FINANCIAL_DOCUMENT";
  }

  if (
    normalizedName.includes("employment") ||
    normalizedName.includes("employer") ||
    normalizedName.includes("employment letter") ||
    normalizedName.includes("work experience")
  ) {
    return "EMPLOYMENT_DOCUMENT";
  }

  return "OTHER";
};

/*
|--------------------------------------------------------------------------
| BUILD REQUIRED DOCUMENT CONFIGURATION
|--------------------------------------------------------------------------
|
| Priority:
|
| 1. Explicit pathway configuration
| 2. Existing public documents array
|
|--------------------------------------------------------------------------
*/

const buildRequiredDocuments = (opportunity) => {
  /*
  |--------------------------------------------------------------------------
  | EXPLICIT REQUIRED DOCUMENTS
  |--------------------------------------------------------------------------
  */

  if (
    Array.isArray(opportunity.requiredDocuments) &&
    opportunity.requiredDocuments.length > 0
  ) {
    return opportunity.requiredDocuments.map((document, index) => {
      const name =
        document?.name ||
        document?.label ||
        document?.title ||
        document?.documentName ||
        `Required Document ${index + 1}`;

      /*
        |--------------------------------------------------------------------------
        | Respect a valid explicit type.
        |--------------------------------------------------------------------------
        */

      const validTypes = [
        "PASSPORT",
        "IDENTIFICATION",
        "ACADEMIC_CERTIFICATE",
        "FINANCIAL_DOCUMENT",
        "EMPLOYMENT_DOCUMENT",
        "OTHER",
      ];

      const type = validTypes.includes(document?.type)
        ? document.type
        : resolveDocumentType(name);

      return {
        key: document?.key || `DOCUMENT_${index + 1}`,

        name,

        label: document?.label || name,

        description: document?.description || "",

        required: document?.required !== false,

        type,

        order: document?.order || index + 1,
      };
    });
  }

  /*
  |--------------------------------------------------------------------------
  | FALLBACK TO PUBLIC DOCUMENT LIST
  |--------------------------------------------------------------------------
  */

  if (
    !Array.isArray(opportunity.documents) ||
    opportunity.documents.length === 0
  ) {
    return [];
  }

  return opportunity.documents.map((document, index) => {
    const name = String(document || "").trim();

    return {
      key: `DOCUMENT_${index + 1}`,

      name,

      label: name,

      description: "",

      required: true,

      type: resolveDocumentType(name),

      order: index + 1,
    };
  });
};

/*
|--------------------------------------------------------------------------
| BUILD APPLICATION QUESTIONS
|--------------------------------------------------------------------------
|
| Questions remain available for future pathway-specific
| requirements, but they are NOT part of the default V1
| client journey.
|
|--------------------------------------------------------------------------
*/

const buildApplicationQuestions = (opportunity) => {
  if (
    Array.isArray(opportunity.questions) &&
    opportunity.questions.length > 0
  ) {
    return opportunity.questions;
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| BUILD APPLICATION CONFIGURATION
|--------------------------------------------------------------------------
*/

const buildApplicationConfig = (opportunity) => {
  const customWorkflow = opportunity.applicationConfig?.workflow;

  const customSteps = opportunity.applicationConfig?.steps;

  return {
    /*
    |--------------------------------------------------------------------------
    | Client-facing application steps
    |--------------------------------------------------------------------------
    */

    steps:
      Array.isArray(customSteps) && customSteps.length > 0
        ? customSteps
        : DEFAULT_APPLICATION_STEPS,

    /*
    |--------------------------------------------------------------------------
    | Future questions
    |--------------------------------------------------------------------------
    */

    questions: buildApplicationQuestions(opportunity),

    /*
    |--------------------------------------------------------------------------
    | Required documents
    |--------------------------------------------------------------------------
    */

    requiredDocuments: buildRequiredDocuments(opportunity),

    /*
    |--------------------------------------------------------------------------
    | Internal workflow
    |--------------------------------------------------------------------------
    */

    workflow:
      Array.isArray(customWorkflow) && customWorkflow.length > 0
        ? customWorkflow
        : buildDefaultWorkflow(),
  };
};

/*
|--------------------------------------------------------------------------
| BUILD OPPORTUNITIES
|--------------------------------------------------------------------------
*/

const buildOpportunities = () => {
  const opportunities = [];

  for (const country of countries) {
    if (!country || !Array.isArray(country.opportunities)) {
      console.warn(
        `⚠ No opportunities found for ${country?.name || "unknown country"}`,
      );

      continue;
    }

    for (const opportunity of country.opportunities) {
      opportunities.push({
        /*
        |--------------------------------------------------------------------------
        | COUNTRY INFORMATION
        |--------------------------------------------------------------------------
        */

        countryId: country.id,

        countryName: country.name,

        countrySlug: country.slug,

        countryFlag: country.flag || "",

        countryImage: country.image || "",

        /*
        |--------------------------------------------------------------------------
        | COUNTRY METADATA
        |--------------------------------------------------------------------------
        */

        applicants: country.applicants || "",

        countryCategories: country.category || [],

        countryVisa: country.visa || "",

        countryDuration: country.duration || "",

        countryProcessingTime: country.processingTime || "",

        countryDescription: country.description || "",

        opportunityScore: country.opportunityScore || "",

        successRate: country.successRate || "",

        featured: country.featured || false,

        /*
        |--------------------------------------------------------------------------
        | OPPORTUNITY IDENTITY
        |--------------------------------------------------------------------------
        */

        legacyId: opportunity.id,

        title: opportunity.title,

        slug: opportunity.slug,

        image: opportunity.image || "",

        category: opportunity.category || "",

        location: opportunity.location || "",

        type: opportunity.type || "",

        duration: opportunity.duration || "",

        icon: opportunity.icon || "",

        /*
        |--------------------------------------------------------------------------
        | OPPORTUNITY DETAILS
        |--------------------------------------------------------------------------
        */

        salary: opportunity.salary || "",

        demand: opportunity.demand || "",

        description: opportunity.description || "",

        /*
        |--------------------------------------------------------------------------
        | HIGHLIGHTS
        |--------------------------------------------------------------------------
        */

        highlights: opportunity.highlights || [],

        /*
        |--------------------------------------------------------------------------
        | REQUIREMENTS
        |--------------------------------------------------------------------------
        */

        requirements: opportunity.requirements || [],

        /*
        |--------------------------------------------------------------------------
        | PUBLIC DOCUMENTS
        |--------------------------------------------------------------------------
        */

        documents: opportunity.documents || [],

        /*
        |--------------------------------------------------------------------------
        | BENEFITS
        |--------------------------------------------------------------------------
        */

        benefits: opportunity.benefits || [],

        /*
        |--------------------------------------------------------------------------
        | APPLICATION JOURNEY
        |--------------------------------------------------------------------------
        */

        steps: opportunity.steps || [],

        /*
        |--------------------------------------------------------------------------
        | POSITIONS
        |--------------------------------------------------------------------------
        */

        positions: opportunity.positions || [],

        /*
        |--------------------------------------------------------------------------
        | WORK CONDITIONS
        |--------------------------------------------------------------------------
        */

        workConditions: opportunity.workConditions || null,

        /*
        |--------------------------------------------------------------------------
        | CONTRACT
        |--------------------------------------------------------------------------
        */

        contract: opportunity.contract || "",

        /*
        |--------------------------------------------------------------------------
        | FAQ
        |--------------------------------------------------------------------------
        */

        faq: opportunity.faq || [],

        /*
        |--------------------------------------------------------------------------
        | PRICING
        |--------------------------------------------------------------------------
        */

        pricing: opportunity.pricing || null,

        /*
        |--------------------------------------------------------------------------
        | PAYMENT PLAN
        |--------------------------------------------------------------------------
        */

        paymentPlan: opportunity.paymentPlan || [],

        /*
        |--------------------------------------------------------------------------
        | TERMS
        |--------------------------------------------------------------------------
        */

        terms: opportunity.terms || [],

        /*
        |--------------------------------------------------------------------------
        | APPLICATION CONFIGURATION
        |--------------------------------------------------------------------------
        */

        applicationConfig: buildApplicationConfig(opportunity),

        /*
        |--------------------------------------------------------------------------
        | ACTIVE
        |--------------------------------------------------------------------------
        */

        active: true,
      });
    }
  }

  return opportunities;
};

/*
|--------------------------------------------------------------------------
| SEED OPPORTUNITIES
|--------------------------------------------------------------------------
*/

const seedOpportunities = async () => {
  const opportunities = buildOpportunities();

  console.log(`Preparing ${opportunities.length} opportunities...`);

  for (const opportunity of opportunities) {
    await Opportunity.findOneAndUpdate(
      {
        countrySlug: opportunity.countrySlug,

        slug: opportunity.slug,
      },

      opportunity,

      {
        upsert: true,

        new: true,

        setDefaultsOnInsert: true,
      },
    );
  }

  console.log(`✓ ${opportunities.length} opportunities seeded successfully.`);
};

export default seedOpportunities;
