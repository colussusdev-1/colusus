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
// BUILD OPPORTUNITIES
// =====================================================

const buildOpportunities = () => {
  const opportunities = [];

  for (const country of countries) {
    // -------------------------------------------------
    // Safety check
    // -------------------------------------------------

    if (!country || !country.opportunities) {
      continue;
    }

    // -------------------------------------------------
    // Convert each frontend opportunity into a
    // backend Opportunity document
    // -------------------------------------------------

    for (const opportunity of country.opportunities) {
      opportunities.push({
        // =================================================
        // COUNTRY INFORMATION
        // =================================================

        countryId: country.id,

        countryName: country.name,

        countrySlug: country.slug,

        countryFlag: country.flag || "",

        /*
         * Frontend images are imported Vite modules.
         *
         * We do NOT store those imports directly in MongoDB.
         *
         * For now keep this empty.
         */

        countryImage: "",

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
        // POSITIONS
        // =================================================

        positions: opportunity.positions || [],

        // =================================================
        // APPLICATION JOURNEY
        // =================================================

        steps: opportunity.steps || [],

        // =================================================
        // PRICING
        // =================================================

        pricing: opportunity.pricing || null,

        // =================================================
        // PAYMENT PLAN
        // =================================================

        paymentPlan: opportunity.paymentPlan || [],

        // =================================================
        // APPLICATION CONFIGURATION
        // =================================================

        applicationConfig: {
          steps: ["PERSONAL_INFORMATION", "DOCUMENTS", "REVIEW"],

          questions: opportunity.questions || [],

          requiredDocuments: opportunity.requiredDocuments || [],

          workflow: [
            {
              key: "APPLICATION_SUBMITTED",

              label: "Application Submitted",

              status: "PENDING",
            },

            {
              key: "DOCUMENT_REVIEW",

              label: "Document Review",

              status: "PENDING",
            },

            {
              key: "PROCESSING",

              label: "Application Processing",

              status: "PENDING",
            },

            {
              key: "FINAL_DECISION",

              label: "Final Decision",

              status: "PENDING",
            },
          ],
        },

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
