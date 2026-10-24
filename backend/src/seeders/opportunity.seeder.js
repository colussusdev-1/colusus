import mongoose from "mongoose";
import { pathToFileURL } from "node:url";

import Opportunity from "../modules/opportunities/opportunity.model.js";
import opportunitiesData from "./data/opportunities.data.js";

/* ==========================================================================
   COLOSSUS — OPPORTUNITY SEEDER
   ==========================================================================

   Features:
   - Uses the validated opportunities.data.js catalogue.
   - Validates country IDs and country-scoped offer identities.
   - Supports --dry-run.
   - Preserves existing MongoDB _id values for matched records.
   - Updates matched records in place.
   - Inserts genuinely new records.
   - Never automatically deletes unmatched records.
   - Reports duplicate existing identities for manual review.
   - Preserves application configuration and required-document handling.
   - Preserves applicationFlow and programDetails.

   ========================================================================== */

/* -------------------------------------------------------------------------- */
/* AUTHORITATIVE COUNTRY REGISTER                                             */
/* -------------------------------------------------------------------------- */

const AUTHORITATIVE_COUNTRIES = new Map([
  [1, { name: "Australia", slug: "australia" }],
  [2, { name: "Bulgaria", slug: "bulgaria" }],
  [3, { name: "Canada", slug: "canada" }],
  [4, { name: "Croatia", slug: "croatia" }],
  [5, { name: "Finland", slug: "finland" }],
  [6, { name: "Germany", slug: "germany" }],
  [7, { name: "Hungary", slug: "hungary" }],
  [8, { name: "Ireland", slug: "ireland" }],
  [9, { name: "Latvia", slug: "latvia" }],
  [10, { name: "Lithuania", slug: "lithuania" }],
  [11, { name: "Norway", slug: "norway" }],
  [12, { name: "Poland", slug: "poland" }],
  [13, { name: "Romania", slug: "romania" }],
  [14, { name: "Serbia", slug: "serbia" }],
  [15, { name: "Spain", slug: "spain" }],
  [16, { name: "United Kingdom", slug: "united-kingdom" }],
  [17, { name: "New Zealand", slug: "new-zealand" }],
]);

/* -------------------------------------------------------------------------- */
/* DEFAULT APPLICATION CONFIGURATION                                         */
/* -------------------------------------------------------------------------- */

const DEFAULT_APPLICATION_STEPS = ["DOCUMENTS", "REVIEW"];

const VALID_DOCUMENT_TYPES = [
  "PASSPORT",
  "IDENTIFICATION",
  "ACADEMIC_CERTIFICATE",
  "FINANCIAL_DOCUMENT",
  "EMPLOYMENT_DOCUMENT",
  "OTHER",
];

/* -------------------------------------------------------------------------- */
/* DOCUMENT TYPE RESOLVER                                                     */
/* -------------------------------------------------------------------------- */

const resolveDocumentType = (documentName) => {
  const name = String(documentName ?? "")
    .trim()
    .toLowerCase();

  if (name.includes("passport")) {
    return "PASSPORT";
  }

  if (
    name.includes("identification") ||
    name.includes("identity") ||
    name.includes("national id") ||
    name.includes("id card")
  ) {
    return "IDENTIFICATION";
  }

  if (
    name.includes("academic") ||
    name.includes("certificate") ||
    name.includes("degree") ||
    name.includes("diploma") ||
    name.includes("transcript")
  ) {
    return "ACADEMIC_CERTIFICATE";
  }

  if (
    name.includes("financial") ||
    name.includes("bank") ||
    name.includes("statement") ||
    name.includes("funds") ||
    name.includes("proof of funds")
  ) {
    return "FINANCIAL_DOCUMENT";
  }

  if (
    name.includes("employment") ||
    name.includes("employer") ||
    name.includes("work experience")
  ) {
    return "EMPLOYMENT_DOCUMENT";
  }

  return "OTHER";
};

/* -------------------------------------------------------------------------- */
/* BUILD REQUIRED DOCUMENTS                                                   */
/* -------------------------------------------------------------------------- */

const buildRequiredDocuments = (opportunity) => {
  const explicitDocuments = opportunity.requiredDocuments;

  if (Array.isArray(explicitDocuments) && explicitDocuments.length > 0) {
    return explicitDocuments.map((document, index) => {
      const name =
        document?.name ||
        document?.label ||
        document?.title ||
        document?.documentName ||
        `Required Document ${index + 1}`;

      const type = VALID_DOCUMENT_TYPES.includes(document?.type)
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

  if (
    !Array.isArray(opportunity.documents) ||
    opportunity.documents.length === 0
  ) {
    return [];
  }

  return opportunity.documents.map((document, index) => {
    const name =
      typeof document === "string"
        ? document.trim()
        : String(
            document?.name || document?.label || document?.title || "",
          ).trim();

    const type = VALID_DOCUMENT_TYPES.includes(document?.type)
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
};

/* -------------------------------------------------------------------------- */
/* DEFAULT INTERNAL WORKFLOW                                                  */
/* -------------------------------------------------------------------------- */

const buildDefaultWorkflow = () => [
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

/* -------------------------------------------------------------------------- */
/* BUILD APPLICATION CONFIGURATION                                           */
/* -------------------------------------------------------------------------- */

const buildApplicationConfig = (opportunity) => {
  const config = opportunity.applicationConfig || {};

  const steps =
    Array.isArray(config.steps) && config.steps.length > 0
      ? config.steps
      : DEFAULT_APPLICATION_STEPS;

  const questions = Array.isArray(config.questions) ? config.questions : [];

  const workflow =
    Array.isArray(config.workflow) && config.workflow.length > 0
      ? config.workflow
      : buildDefaultWorkflow();

  return {
    steps,
    questions,
    requiredDocuments: buildRequiredDocuments(opportunity),
    workflow,
  };
};

/* -------------------------------------------------------------------------- */
/* VALIDATE SOURCE DATA                                                       */
/* -------------------------------------------------------------------------- */

const validateOpportunities = (opportunities) => {
  const errors = [];
  const seenKeys = new Set();

  if (!Array.isArray(opportunities) || opportunities.length === 0) {
    throw new Error(
      "Opportunity source data is empty. No database writes were performed.",
    );
  }

  for (const opportunity of opportunities) {
    if (!opportunity || typeof opportunity !== "object") {
      errors.push("Invalid opportunity record encountered.");
      continue;
    }

    const country = AUTHORITATIVE_COUNTRIES.get(Number(opportunity.countryId));

    if (!country) {
      errors.push(
        `Unknown country ID "${opportunity.countryId}" for ` +
          `"${opportunity.title || "Unknown opportunity"}".`,
      );

      continue;
    }

    if (
      opportunity.countryName !== country.name ||
      opportunity.countrySlug !== country.slug
    ) {
      errors.push(
        `Country metadata mismatch for "${opportunity.title}". ` +
          `Expected "${country.name}" (${country.slug}); received ` +
          `"${opportunity.countryName}" (${opportunity.countrySlug}).`,
      );
    }

    if (!Number.isInteger(opportunity.legacyId)) {
      errors.push(
        `Invalid legacyId for "${opportunity.title || "Unknown opportunity"}".`,
      );
    }

    if (!opportunity.title || !opportunity.slug) {
      errors.push(`Missing title or slug for country "${country.name}".`);

      continue;
    }

    const key = `${opportunity.countrySlug}:${opportunity.slug}`;

    if (seenKeys.has(key)) {
      errors.push(`Duplicate source opportunity identity "${key}".`);
    }

    seenKeys.add(key);

    if (
      opportunity.applicationFlow != null &&
      !["DIRECT_APPLICATION", "ASSESSMENT_FIRST"].includes(
        opportunity.applicationFlow,
      )
    ) {
      errors.push(`Invalid applicationFlow for "${opportunity.title}".`);
    }

    if (
      opportunity.programDetails != null &&
      (typeof opportunity.programDetails !== "object" ||
        Array.isArray(opportunity.programDetails))
    ) {
      errors.push(`Invalid programDetails for "${opportunity.title}".`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      [
        "Opportunity validation failed. No database writes were performed.",
        ...errors.map((error) => `- ${error}`),
      ].join("\n"),
    );
  }
};

/* -------------------------------------------------------------------------- */
/* BUILD DATABASE DOCUMENT                                                    */
/* -------------------------------------------------------------------------- */

const buildOpportunityDocument = (opportunity) => ({
  ...opportunity,

  applicationFlow: opportunity.applicationFlow || "DIRECT_APPLICATION",

  programDetails: opportunity.programDetails ?? null,

  applicationConfig: buildApplicationConfig(opportunity),

  active: opportunity.active !== false,
});

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getOpportunityKey = (opportunity) =>
  `${opportunity.countrySlug}:${opportunity.slug}`;

const summarizeRecord = (record) => ({
  id: String(record._id),
  title: record.title || "",
  countryId: record.countryId ?? null,
  countryName: record.countryName || "",
  countrySlug: record.countrySlug || "",
  slug: record.slug || "",
  active: record.active !== false,
});

/* -------------------------------------------------------------------------- */
/* SEED OPPORTUNITIES                                                         */
/* -------------------------------------------------------------------------- */

const seedOpportunities = async () => {
  const dryRun = process.argv.includes("--dry-run");

  const opportunities = opportunitiesData.map(buildOpportunityDocument);

  /*
   * Validate the complete source before any writes.
   */
  validateOpportunities(opportunities);

  console.log("\n========================================");
  console.log("COLOSSUS OPPORTUNITY SEEDER");
  console.log("========================================");

  console.log(`Source opportunities: ${opportunities.length}`);
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);

  /*
   * Load existing records without changing them.
   */
  const existingRecords = await Opportunity.find({})
    .select(
      [
        "_id",
        "legacyId",
        "title",
        "slug",
        "countryId",
        "countryName",
        "countrySlug",
        "active",
      ].join(" "),
    )
    .lean();

  /*
   * Group records by country-scoped identity.
   */
  const existingByKey = new Map();

  for (const record of existingRecords) {
    const key = getOpportunityKey(record);

    if (!existingByKey.has(key)) {
      existingByKey.set(key, []);
    }

    existingByKey.get(key).push(record);
  }

  /*
   * Identify duplicate identities in the existing database.
   */
  const existingDuplicates = [];

  for (const [key, records] of existingByKey.entries()) {
    if (records.length > 1) {
      existingDuplicates.push({
        key,
        records: records.map(summarizeRecord),
      });
    }
  }

  /*
   * Compare source catalogue against existing records.
   */
  const sourceKeys = new Set(opportunities.map(getOpportunityKey));

  const updates = [];
  const inserts = [];
  const manualReview = [];

  for (const opportunity of opportunities) {
    const key = getOpportunityKey(opportunity);
    const matches = existingByKey.get(key) || [];

    if (matches.length > 1) {
      manualReview.push({
        key,
        reason: "Multiple existing records share this country-scoped identity.",
        records: matches.map(summarizeRecord),
      });

      continue;
    }

    if (matches.length === 1) {
      updates.push({
        key,
        existingId: String(matches[0]._id),
        opportunity,
      });

      continue;
    }

    inserts.push({
      key,
      opportunity,
    });
  }

  /*
   * Existing records absent from the source catalogue are retained.
   */
  const unmatchedExisting = existingRecords.filter(
    (record) => !sourceKeys.has(getOpportunityKey(record)),
  );

  /*
   * Display comparison summary.
   */
  console.log(`Existing opportunities: ${existingRecords.length}`);
  console.log(`Planned updates: ${updates.length}`);
  console.log(`Planned inserts: ${inserts.length}`);
  console.log(`Duplicate existing identities: ${existingDuplicates.length}`);
  console.log(`Manual review cases: ${manualReview.length}`);
  console.log(`Unmatched existing records: ${unmatchedExisting.length}`);

  if (existingDuplicates.length > 0) {
    console.log("\nEXISTING DUPLICATE IDENTITIES");

    for (const duplicate of existingDuplicates) {
      console.log(`\nIdentity: ${duplicate.key}`);
      console.table(duplicate.records);
    }
  }

  if (manualReview.length > 0) {
    console.log("\nMANUAL REVIEW REQUIRED");

    for (const item of manualReview) {
      console.log(`\nIdentity: ${item.key}`);
      console.log(`Reason: ${item.reason}`);
      console.table(item.records);
    }
  }

  if (unmatchedExisting.length > 0) {
    console.log("\nUNMATCHED EXISTING RECORDS — RETAINED");

    console.table(unmatchedExisting.map(summarizeRecord));
  }

  /*
   * Dry-run mode stops before the first database write.
   */
  if (dryRun) {
    console.log("\nDRY RUN COMPLETE.");
    console.log("MongoDB writes: NONE");
    console.log("No records were inserted, updated, or deleted.");
    console.log("========================================\n");

    return {
      mode: "DRY_RUN",
      sourceCount: opportunities.length,
      existingCount: existingRecords.length,
      plannedUpdates: updates.length,
      plannedInserts: inserts.length,
      duplicateIdentityCount: existingDuplicates.length,
      manualReviewCount: manualReview.length,
      unmatchedCount: unmatchedExisting.length,
    };
  }

  /*
   * Fail closed when the existing database contains ambiguous identities.
   */
  if (existingDuplicates.length > 0 || manualReview.length > 0) {
    throw new Error(
      "Seeder stopped before writing: duplicate or ambiguous existing " +
        "opportunity identities require manual review.",
    );
  }

  /*
   * UPDATE MATCHED RECORDS
   *
   * updateOne with $set preserves the existing MongoDB _id.
   */
  let updatedCount = 0;
  let insertedCount = 0;

  for (const { key, opportunity } of updates) {
    const result = await Opportunity.updateOne(
      {
        countrySlug: opportunity.countrySlug,
        slug: opportunity.slug,
      },
      {
        $set: opportunity,
      },
      {
        runValidators: true,
      },
    );

    if (result.matchedCount !== 1) {
      throw new Error(
        `Expected exactly one matching record for "${key}", ` +
          `but matched ${result.matchedCount}.`,
      );
    }

    updatedCount += 1;
  }

  /*
   * INSERT NEW RECORDS
   */
  for (const { key, opportunity } of inserts) {
    try {
      await Opportunity.create(opportunity);
      insertedCount += 1;
    } catch (error) {
      throw new Error(
        `Failed to insert opportunity "${key}": ${error.message}`,
      );
    }
  }

  /*
   * Final summary.
   */
  console.log("\nSEED COMPLETE");
  console.log("========================================");
  console.log(`Updated: ${updatedCount}`);
  console.log(`Inserted: ${insertedCount}`);
  console.log(`Unmatched records retained: ${unmatchedExisting.length}`);
  console.log("Existing opportunity records were not intentionally deleted.");
  console.log("========================================\n");

  return {
    mode: "LIVE",
    sourceCount: opportunities.length,
    updatedCount,
    insertedCount,
    unmatchedCount: unmatchedExisting.length,
  };
};

export default seedOpportunities;

/* -------------------------------------------------------------------------- */
/* DIRECT EXECUTION                                                           */
/* -------------------------------------------------------------------------- */

const isDirectExecution =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error(
      "MongoDB connection string is missing. " +
        "Set MONGO_URI or MONGODB_URI in the environment.",
    );

    process.exitCode = 1;
  } else {
    mongoose
      .connect(mongoUri)
      .then(() => seedOpportunities())
      .catch((error) => {
        console.error("\nOPPORTUNITY SEEDER FAILED");
        console.error(error);

        process.exitCode = 1;
      })
      .finally(async () => {
        await mongoose.disconnect().catch(() => {});
      });
  }
}
