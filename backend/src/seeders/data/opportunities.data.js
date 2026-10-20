import australia from "./australia.js";
import bulgaria from "./bulgaria.js";
import canada from "./canada.js";
import croatia from "./croatia.js";
import finland from "./finland.js";
import germany from "./germany.js";
import hungary from "./hungary.js";
import ireland from "./ireland.js";
import latvia from "./latvia.js";
import lithuania from "./lithuania.js";
import norway from "./norway.js";
import poland from "./poland.js";
import romania from "./romania.js";
import serbia from "./serbia.js";
import spain from "./spain.js";
import uk from "./uk.js";

/* -------------------------------------------------------------------------- */
/* COUNTRY DATA                                                               */
/* -------------------------------------------------------------------------- */

const countries = [
  australia,
  bulgaria,
  canada,
  croatia,
  finland,
  germany,
  hungary,
  ireland,
  latvia,
  lithuania,
  norway,
  poland,
  romania,
  serbia,
  spain,
  uk,
];

/* -------------------------------------------------------------------------- */
/* VALIDATE COUNTRY DATA                                                      */
/* -------------------------------------------------------------------------- */

const errors = [];
const warnings = [];

const countryIds = new Map();
const countrySlugs = new Map();
const opportunityKeys = new Map();
const opportunityIds = new Map();

/* -------------------------------------------------------------------------- */
/* NORMALIZATION HELPERS                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Converts public-facing migration pathway steps into the embedded-object
 * structure expected by Opportunity.steps.
 *
 * Supports existing string entries and structured objects.
 */
function normalizeJourneySteps(steps, opportunityTitle) {
  if (steps == null) {
    return [];
  }

  if (!Array.isArray(steps)) {
    errors.push(`"${opportunityTitle}" has invalid steps: expected an array.`);

    return [];
  }

  return steps
    .map((step, index) => {
      if (typeof step === "string") {
        const title = step.trim();

        if (!title) {
          warnings.push(
            `"${opportunityTitle}" has an empty journey step at index ${index}.`,
          );

          return null;
        }

        return {
          title,
          description: "",
          duration: "",
        };
      }

      if (step && typeof step === "object" && !Array.isArray(step)) {
        return {
          title: String(step.title ?? "").trim(),
          description: String(step.description ?? "").trim(),
          duration: String(step.duration ?? "").trim(),
        };
      }

      errors.push(
        `"${opportunityTitle}" has an invalid journey step at index ${index}.`,
      );

      return null;
    })
    .filter(Boolean);
}

/**
 * Ensures applicationConfig.steps remains an array of strings.
 *
 * This field is separate from the public-facing Opportunity.steps field.
 */
function normalizeApplicationConfig(config, opportunityTitle) {
  const defaults = {
    steps: ["PERSONAL_INFORMATION", "DOCUMENTS", "REVIEW"],
    questions: [],
    requiredDocuments: [],
    workflow: [],
  };

  if (config == null) {
    return defaults;
  }

  if (typeof config !== "object" || Array.isArray(config)) {
    errors.push(`"${opportunityTitle}" has invalid applicationConfig.`);

    return defaults;
  }

  let applicationSteps = defaults.steps;

  if (config.steps !== undefined && config.steps !== null) {
    if (
      !Array.isArray(config.steps) ||
      config.steps.some((step) => typeof step !== "string")
    ) {
      errors.push(
        `"${opportunityTitle}" has invalid applicationConfig.steps; ` +
          "expected an array of strings.",
      );
    } else {
      applicationSteps = config.steps;
    }
  }

  return {
    ...config,
    steps: applicationSteps,
    questions: Array.isArray(config.questions) ? config.questions : [],
    requiredDocuments: Array.isArray(config.requiredDocuments)
      ? config.requiredDocuments
      : [],
    workflow: Array.isArray(config.workflow) ? config.workflow : [],
  };
}

/* -------------------------------------------------------------------------- */
/* VALIDATE COUNTRIES AND OPPORTUNITIES                                       */
/* -------------------------------------------------------------------------- */

for (const country of countries) {
  if (!country || typeof country !== "object") {
    errors.push("Invalid country entry found.");
    continue;
  }

  if (!Number.isInteger(country.id)) {
    errors.push(
      `Invalid country ID for "${country.name || "Unknown"}": ${country.id}`,
    );
  }

  if (!country.name || !country.slug) {
    errors.push(`Country ID ${country.id} is missing its name or slug.`);
  }

  if (!Array.isArray(country.opportunities)) {
    errors.push(
      `Country "${country.name}" does not have an opportunities array.`,
    );

    continue;
  }

  if (countryIds.has(country.id)) {
    errors.push(
      `Duplicate country ID ${country.id}: ` +
        `"${countryIds.get(country.id)}" and "${country.name}".`,
    );
  } else {
    countryIds.set(country.id, country.name);
  }

  if (countrySlugs.has(country.slug)) {
    errors.push(
      `Duplicate country slug "${country.slug}": ` +
        `"${countrySlugs.get(country.slug)}" and "${country.name}".`,
    );
  } else {
    countrySlugs.set(country.slug, country.name);
  }

  if (country.opportunities.length === 0) {
    warnings.push(`Country "${country.name}" has no opportunities.`);
  }

  const localOfferIds = new Set();

  for (const opportunity of country.opportunities) {
    if (!opportunity || typeof opportunity !== "object") {
      errors.push(`Invalid opportunity in country "${country.name}".`);

      continue;
    }

    if (!Number.isInteger(opportunity.id)) {
      errors.push(
        `Invalid opportunity ID in "${country.name}": ${opportunity.id}`,
      );
    }

    if (localOfferIds.has(opportunity.id)) {
      errors.push(
        `Duplicate opportunity ID ${opportunity.id} ` +
          `inside "${country.name}".`,
      );
    }

    localOfferIds.add(opportunity.id);

    if (!opportunity.title || !opportunity.slug) {
      errors.push(
        `Opportunity in "${country.name}" is missing its title or slug.`,
      );

      continue;
    }

    const key = `${country.slug}:${opportunity.slug}`;

    if (opportunityKeys.has(key)) {
      errors.push(
        `Duplicate opportunity key "${key}" found in ` +
          `"${opportunityKeys.get(key)}" and "${country.name}".`,
      );
    } else {
      opportunityKeys.set(key, country.name);
    }

    if (!opportunity.description) {
      warnings.push(
        `"${opportunity.title}" in "${country.name}" has no description.`,
      );
    }

    if (!Array.isArray(opportunity.requirements)) {
      warnings.push(
        `"${opportunity.title}" in "${country.name}" has invalid requirements.`,
      );
    }

    if (!Array.isArray(opportunity.documents)) {
      warnings.push(
        `"${opportunity.title}" in "${country.name}" has invalid documents.`,
      );
    }

    if (opportunity.paymentPlan && !Array.isArray(opportunity.paymentPlan)) {
      errors.push(
        `"${opportunity.title}" in "${country.name}" has an invalid payment plan.`,
      );
    }

    if (opportunity.steps != null && !Array.isArray(opportunity.steps)) {
      errors.push(
        `"${opportunity.title}" in "${country.name}" has invalid steps.`,
      );
    }

    if (
      opportunity.applicationConfig != null &&
      (typeof opportunity.applicationConfig !== "object" ||
        Array.isArray(opportunity.applicationConfig))
    ) {
      errors.push(
        `"${opportunity.title}" in "${country.name}" has invalid applicationConfig.`,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* FLATTEN COUNTRY DATA                                                       */
/* -------------------------------------------------------------------------- */

const opportunities = countries.flatMap((country) => {
  if (!country || !Array.isArray(country.opportunities)) {
    return [];
  }

  return country.opportunities.map((opportunity) => ({
    /* Country information */

    countryId: country.id,
    countryName: country.name,
    countrySlug: country.slug,
    countryFlag: country.flag || "",
    countryImage: "",

    /* Country metadata */

    applicants: country.applicants || "",
    countryCategories: country.category || [],
    countryVisa: country.visa || "",
    countryDuration: country.duration || "",
    countryProcessingTime: country.processingTime || "",
    countryDescription: country.description || "",
    opportunityScore: country.opportunityScore || "",
    successRate: country.successRate || "",
    featured: country.featured ?? false,

    /* Opportunity identity */

    legacyId: opportunity.id,
    title: opportunity.title,
    slug: opportunity.slug,
    category: opportunity.category || "",
    location: opportunity.location || "",
    type: opportunity.type || "",
    duration: opportunity.duration || "",
    icon: opportunity.icon || "",

    /* Opportunity details */

    salary: opportunity.salary || "",
    demand: opportunity.demand || "",
    description: opportunity.description || "",

    /* Opportunity content */

    highlights: Array.isArray(opportunity.highlights)
      ? opportunity.highlights
      : [],

    requirements: Array.isArray(opportunity.requirements)
      ? opportunity.requirements
      : [],

    documents: Array.isArray(opportunity.documents)
      ? opportunity.documents
      : [],

    benefits: Array.isArray(opportunity.benefits) ? opportunity.benefits : [],

    /*
     * FIX:
     * Opportunity.steps requires embedded objects containing
     * title, description and duration.
     */
    steps: normalizeJourneySteps(opportunity.steps, opportunity.title),

    positions: Array.isArray(opportunity.positions)
      ? opportunity.positions
      : [],

    workConditions: opportunity.workConditions ?? null,

    contract: opportunity.contract || "",

    faq: Array.isArray(opportunity.faq) ? opportunity.faq : [],

    /* Finance */

    pricing: opportunity.pricing ?? null,

    paymentPlan: Array.isArray(opportunity.paymentPlan)
      ? opportunity.paymentPlan
      : [],

    terms: Array.isArray(opportunity.terms) ? opportunity.terms : [],

    /*
     * Application configuration.
     *
     * Keep applicationConfig.steps as strings.
     * These are not the same as the public-facing journey steps above.
     */
    applicationConfig: normalizeApplicationConfig(
      opportunity.applicationConfig,
      opportunity.title,
    ),

    /* Status */

    active: true,
  }));
});

/* -------------------------------------------------------------------------- */
/* VALIDATE FLATTENED DATA                                                    */
/* -------------------------------------------------------------------------- */

for (const opportunity of opportunities) {
  const key = `${opportunity.countrySlug}:${opportunity.slug}`;

  if (opportunityIds.has(key)) {
    errors.push(`Duplicate flattened opportunity: "${key}".`);
  } else {
    opportunityIds.set(key, opportunity.title);
  }

  if (!Number.isInteger(opportunity.legacyId)) {
    errors.push(`"${opportunity.title}" has an invalid legacyId.`);
  }

  if (
    !Array.isArray(opportunity.steps) ||
    opportunity.steps.some(
      (step) =>
        !step ||
        typeof step !== "object" ||
        Array.isArray(step) ||
        typeof step.title !== "string" ||
        typeof step.description !== "string" ||
        typeof step.duration !== "string",
    )
  ) {
    errors.push(`"${opportunity.title}" has invalid normalized journey steps.`);
  }

  if (
    !Array.isArray(opportunity.applicationConfig.steps) ||
    opportunity.applicationConfig.steps.some((step) => typeof step !== "string")
  ) {
    errors.push(
      `"${opportunity.title}" has invalid application workflow steps.`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

console.log("\n========================================");
console.log(" COLOSSUS OPPORTUNITY DATA VALIDATION");
console.log("========================================");

console.log(`Countries loaded: ${countries.length}`);

console.log(`Opportunities prepared: ${opportunities.length}`);

console.log(`Unique country IDs: ${countryIds.size}`);

console.log(`Unique country slugs: ${countrySlugs.size}`);

console.log("\nCountries:");

for (const country of countries) {
  console.log(
    `  ${String(country.id).padStart(2, "0")} | ` +
      `${country.name} | ${country.slug} | ` +
      `${country.opportunities?.length || 0} opportunities`,
  );
}

if (warnings.length > 0) {
  console.log(`\nWARNINGS (${warnings.length}):`);

  for (const warning of warnings) {
    console.warn(`  - ${warning}`);
  }
}

if (errors.length > 0) {
  console.error(`\nVALIDATION FAILED (${errors.length} errors):`);

  for (const error of errors) {
    console.error(`  - ${error}`);
  }

  throw new Error("Opportunity data validation failed. Do not run the seeder.");
}

console.log("\nVALIDATION PASSED");

console.log("No duplicate country IDs or country-scoped offer keys found.");

console.log("Journey steps and application workflow steps have valid formats.");

console.log("========================================\n");

export default opportunities;
