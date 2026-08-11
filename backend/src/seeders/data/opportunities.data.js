import australia from "./australia.js";
import bulgaria from "./bulgaria.js";
import canada from "./canada.js";
import croatia from "./croatia.js";
import finland from "./finland.js";
import germany from "./germany.js";
import hungary from "./hungary.js";
import latvia from "./latvia.js";
import lithuania from "./lithuania.js";
import norway from "./norway.js";
import poland from "./poland.js";
import romania from "./romania.js";
import serbia from "./serbia.js";
import spain from "./spain.js";
import uk from "./uk.js";

/*
|--------------------------------------------------------------------------
| COUNTRY DATA
|--------------------------------------------------------------------------
|
| These are the existing migration opportunity datasets.
| We are reusing the same data that currently powers
| the frontend.
|
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
| FLATTEN COUNTRY DATA
|--------------------------------------------------------------------------
|
| Frontend structure:
|
| country
|   └── opportunities[]
|
| Backend structure:
|
| one MongoDB document per opportunity
|
*/

const opportunities = countries.flatMap((country) => {
  /*
    |--------------------------------------------------------------------------
    | Safety check
    |--------------------------------------------------------------------------
    */

  if (!country || !Array.isArray(country.opportunities)) {
    console.warn(
      `⚠ No opportunities found for ${country?.name || "unknown country"}`,
    );

    return [];
  }

  /*
    |--------------------------------------------------------------------------
    | Convert each frontend opportunity into a backend document
    |--------------------------------------------------------------------------
    */

  return country.opportunities.map((opportunity) => ({
    // =====================================================
    // COUNTRY INFORMATION
    // =====================================================

    countryId: country.id,

    countryName: country.name,

    countrySlug: country.slug,

    countryFlag: country.flag || "",

    /*
        | The country image currently points to a frontend
        | imported asset. We intentionally leave this empty
        | in the backend for now.
        */

    countryImage: "",

    // =====================================================
    // COUNTRY METADATA
    // =====================================================

    applicants: country.applicants || "",

    countryCategories: country.category || [],

    countryVisa: country.visa || "",

    countryDuration: country.duration || "",

    countryProcessingTime: country.processingTime || "",

    countryDescription: country.description || "",

    opportunityScore: country.opportunityScore || "",

    successRate: country.successRate || "",

    featured: country.featured || false,

    // =====================================================
    // OPPORTUNITY IDENTITY
    // =====================================================

    legacyId: opportunity.id,

    title: opportunity.title,

    slug: opportunity.slug,

    category: opportunity.category || "",

    location: opportunity.location || "",

    type: opportunity.type || "",

    duration: opportunity.duration || "",

    icon: opportunity.icon || "",

    // =====================================================
    // OPPORTUNITY DETAILS
    // =====================================================

    salary: opportunity.salary || "",

    demand: opportunity.demand || "",

    description: opportunity.description || "",

    // =====================================================
    // HIGHLIGHTS
    // =====================================================

    highlights: opportunity.highlights || [],

    // =====================================================
    // REQUIREMENTS
    // =====================================================

    requirements: opportunity.requirements || [],

    // =====================================================
    // DOCUMENTS
    // =====================================================

    documents: opportunity.documents || [],

    // =====================================================
    // BENEFITS
    // =====================================================

    benefits: opportunity.benefits || [],

    // =====================================================
    // APPLICATION JOURNEY
    // =====================================================

    steps: opportunity.steps || [],

    // =====================================================
    // POSITIONS
    // =====================================================

    positions: opportunity.positions || [],

    // =====================================================
    // WORK CONDITIONS
    // =====================================================

    workConditions: opportunity.workConditions || null,

    // =====================================================
    // CONTRACT
    // =====================================================

    contract: opportunity.contract || "",

    // =====================================================
    // FAQ
    // =====================================================

    faq: opportunity.faq || [],

    // =====================================================
    // PRICING
    // =====================================================

    pricing: opportunity.pricing || null,

    // =====================================================
    // PAYMENT PLAN
    // =====================================================

    paymentPlan: opportunity.paymentPlan || [],

    // =====================================================
    // TERMS
    // =====================================================

    terms: opportunity.terms || [],

    // =====================================================
    // APPLICATION CONFIGURATION
    // =====================================================
    //
    // If an opportunity already has its own applicationConfig,
    // preserve it.
    //
    // Otherwise give it the default application structure.
    //

    applicationConfig: opportunity.applicationConfig || {
      steps: ["PERSONAL_INFORMATION", "DOCUMENTS", "REVIEW"],

      questions: [],

      requiredDocuments: [],

      workflow: [],
    },

    // =====================================================
    // ACTIVE
    // =====================================================

    active: true,
  }));
});

/*
|--------------------------------------------------------------------------
| Seeder Information
|--------------------------------------------------------------------------
*/

console.log(
  `Prepared ${opportunities.length} opportunities from ${countries.length} countries.`,
);

export default opportunities;
