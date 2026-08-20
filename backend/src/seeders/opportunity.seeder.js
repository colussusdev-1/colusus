import Opportunity from "../modules/opportunities/opportunity.model.js";

// =====================================================
// COUNTRY DATA
// =====================================================

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

// =====================================================
// ALL COUNTRIES
// =====================================================

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

// =====================================================
// DEFAULT APPLICATION WORKFLOW
// =====================================================

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

// =====================================================
// BUILD REQUIRED DOCUMENT CONFIGURATION
// =====================================================

const buildRequiredDocuments = (opportunity) => {
  // If a pathway explicitly defines requiredDocuments,
  // use those instead of the generic documents list.

  if (
    Array.isArray(opportunity.requiredDocuments) &&
    opportunity.requiredDocuments.length > 0
  ) {
    return opportunity.requiredDocuments;
  }

  // Otherwise convert the existing documents array
  // into the application wizard configuration.

  if (
    !Array.isArray(opportunity.documents) ||
    opportunity.documents.length === 0
  ) {
    return [];
  }

  return opportunity.documents.map((document, index) => ({
    key: `DOCUMENT_${index + 1}`,
    label: document,
    required: true,
    type: "FILE",
    order: index + 1,
  }));
};

// =====================================================
// BUILD APPLICATION QUESTIONS
// =====================================================

const buildApplicationQuestions = (opportunity) => {
  if (
    Array.isArray(opportunity.questions) &&
    opportunity.questions.length > 0
  ) {
    return opportunity.questions;
  }

  return [];
};

// =====================================================
// BUILD APPLICATION CONFIGURATION
// =====================================================

const buildApplicationConfig = (opportunity) => {
  const customWorkflow = opportunity.applicationConfig?.workflow;

  return {
    steps: ["PERSONAL_INFORMATION", "QUESTIONS", "DOCUMENTS", "REVIEW"],

    questions: buildApplicationQuestions(opportunity),

    requiredDocuments: buildRequiredDocuments(opportunity),

    workflow:
      Array.isArray(customWorkflow) && customWorkflow.length > 0
        ? customWorkflow
        : buildDefaultWorkflow(),
  };
};

// =====================================================
// BUILD OPPORTUNITIES
// =====================================================

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
        // =================================================
        // COUNTRY INFORMATION
        // =================================================

        countryId: country.id,

        countryName: country.name,

        countrySlug: country.slug,

        countryFlag: country.flag || "",

        countryImage: country.image || "",

        // =================================================
        // COUNTRY METADATA
        // =================================================

        applicants: country.applicants || "",

        countryCategories: country.category || [],

        countryVisa: country.visa || "",

        countryDuration: country.duration || "",

        countryProcessingTime: country.processingTime || "",

        countryDescription: country.description || "",

        opportunityScore: country.opportunityScore || "",

        successRate: country.successRate || "",

        featured: country.featured || false,

        // =================================================
        // OPPORTUNITY IDENTITY
        // =================================================

        legacyId: opportunity.id,

        title: opportunity.title,

        slug: opportunity.slug,

        image: opportunity.image || "",

        category: opportunity.category || "",

        location: opportunity.location || "",

        type: opportunity.type || "",

        duration: opportunity.duration || "",

        icon: opportunity.icon || "",

        // =================================================
        // OPPORTUNITY DETAILS
        // =================================================

        salary: opportunity.salary || "",

        demand: opportunity.demand || "",

        description: opportunity.description || "",

        // =================================================
        // HIGHLIGHTS
        // =================================================

        highlights: opportunity.highlights || [],

        // =================================================
        // REQUIREMENTS
        // =================================================

        requirements: opportunity.requirements || [],

        // =================================================
        // DOCUMENTS
        // =================================================

        documents: opportunity.documents || [],

        // =================================================
        // BENEFITS
        // =================================================

        benefits: opportunity.benefits || [],

        // =================================================
        // APPLICATION JOURNEY
        // =================================================

        steps: opportunity.steps || [],

        // =================================================
        // POSITIONS
        // =================================================

        positions: opportunity.positions || [],

        // =================================================
        // WORK CONDITIONS
        // =================================================

        workConditions: opportunity.workConditions || null,

        // =================================================
        // CONTRACT
        // =================================================

        contract: opportunity.contract || "",

        // =================================================
        // FAQ
        // =================================================

        faq: opportunity.faq || [],

        // =================================================
        // PRICING
        // =================================================

        pricing: opportunity.pricing || null,

        // =================================================
        // PAYMENT PLAN
        // =================================================

        paymentPlan: opportunity.paymentPlan || [],

        // =================================================
        // TERMS
        // =================================================

        terms: opportunity.terms || [],

        // =================================================
        // APPLICATION CONFIGURATION
        // =================================================

        applicationConfig: buildApplicationConfig(opportunity),

        // =================================================
        // ACTIVE
        // =================================================

        active: true,
      });
    }
  }

  return opportunities;
};

// =====================================================
// SEED OPPORTUNITIES
// =====================================================

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
