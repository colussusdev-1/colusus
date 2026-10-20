import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

import Opportunity from "../modules/opportunities/opportunity.model.js";
import Application from "../modules/applications/application.model.js";
import opportunitiesData from "../seeders/data/opportunities.data.js";

/* ==========================================================================
   PATHS AND ENVIRONMENT
   ========================================================================== */

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/*
 * Script location:
 * backend/src/scripts/resetOpportunities.js
 *
 * BACKEND_DIR resolves to:
 * backend/
 *
 * This works whether the script is executed from the project root
 * or directly from the backend directory.
 */

const BACKEND_DIR = path.resolve(SCRIPT_DIR, "../..");

const ENV_PATH = path.join(BACKEND_DIR, ".env");

dotenv.config({
  path: ENV_PATH,
});

/* ==========================================================================
   CONFIGURATION
   ========================================================================== */

const EXPECTED_SOURCE_COUNT = 25;

const EXPECTED_DATABASE_NAME = "test";

const BELGIUM_LEGACY_TITLE = "Belgium Poultry Production & Packaging Worker";

const REVIEW_REPORT_PATH = path.join(
  BACKEND_DIR,
  "opportunity-reset-review.json",
);

/* ==========================================================================
   HELPERS
   ========================================================================== */

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const idString = (value) => String(value ?? "");

const sourceKey = (opportunity) =>
  `${opportunity.countrySlug}::${opportunity.slug}`;

const databaseKey = (opportunity) =>
  `${opportunity.countrySlug}::${opportunity.slug}`;

const isBelgiumLegacyApplication = (application) => {
  const snapshot = application.opportunitySnapshot ?? {};

  return (
    normalize(snapshot.title) === normalize(BELGIUM_LEGACY_TITLE) &&
    normalize(snapshot.countryName) === "belgium" &&
    normalize(application.destinationCountry) === "belgium"
  );
};

/* ==========================================================================
   VALIDATE AUTHORITATIVE SOURCE
   ========================================================================== */

function validateSource(source) {
  if (!Array.isArray(source) || source.length !== EXPECTED_SOURCE_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_SOURCE_COUNT} authoritative opportunities; ` +
        `found ${source?.length ?? 0}.`,
    );
  }

  const keys = new Set();

  const countryIds = new Set();

  const countrySlugs = new Set();

  for (const opportunity of source) {
    if (
      !opportunity ||
      !opportunity.countrySlug ||
      !opportunity.slug ||
      !opportunity.title
    ) {
      throw new Error(
        "The source catalogue contains an opportunity with missing " +
          "title, countrySlug, or slug.",
      );
    }

    const key = sourceKey(opportunity);

    if (keys.has(key)) {
      throw new Error(`Duplicate source opportunity identity: ${key}`);
    }

    keys.add(key);

    if (opportunity.countryId !== undefined) {
      countryIds.add(String(opportunity.countryId));
    }

    countrySlugs.add(opportunity.countrySlug);
  }

  console.log("\n========================================");
  console.log("COLOSSUS OPPORTUNITY DATA VALIDATION");
  console.log("========================================");

  console.log("Countries loaded:", countrySlugs.size);

  console.log("Opportunities prepared:", source.length);

  console.log("Unique country IDs:", countryIds.size);

  console.log("Unique country slugs:", countrySlugs.size);

  console.log("\nVALIDATION PASSED");

  console.log("No duplicate country-scoped offer keys found.");

  console.log("========================================\n");
}

/* ==========================================================================
   GROUP EXISTING OPPORTUNITIES BY IDENTITY
   ========================================================================== */

function groupByIdentity(records) {
  const groups = new Map();

  for (const record of records) {
    const key = databaseKey(record);

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(record);
  }

  return groups;
}

/* ==========================================================================
   MATCH APPLICATIONS TO AUTHORITATIVE OPPORTUNITIES
   ========================================================================== */

function buildApplicationPlan(applications, source, existing) {
  const plans = [];

  const unmatched = [];

  const preservedLegacyApplications = [];

  const existingIds = new Set(existing.map((record) => idString(record._id)));

  for (const application of applications) {
    const snapshot = application.opportunitySnapshot ?? {};

    const title = normalize(snapshot.title);

    const countrySlug = normalize(snapshot.countrySlug);

    /*
     * First, attempt an exact title and country match.
     */

    let candidates = source.filter(
      (opportunity) =>
        normalize(opportunity.title) === title &&
        normalize(opportunity.countrySlug) === countrySlug,
    );

    /*
     * Some historical records may contain incorrect country metadata.
     *
     * If the exact title and country match fails, permit a title-only
     * match only when exactly one source opportunity has that title.
     */

    if (candidates.length === 0) {
      candidates = source.filter(
        (opportunity) => normalize(opportunity.title) === title,
      );
    }

    /*
     * Uniquely matched applications can be reconnected to the
     * authoritative catalogue.
     */

    if (candidates.length === 1) {
      const match = candidates[0];

      plans.push({
        applicationId: application._id,

        currentOpportunityId: idString(application.opportunity),

        sourceKey: sourceKey(match),

        matchedTitle: match.title,

        matchedCountry: match.countryName,
      });

      continue;
    }

    /*
     * BELGIUM LEGACY PROTECTION
     *
     * Belgium is not part of the new catalogue.
     *
     * Never map its application to an unrelated opportunity.
     *
     * Preserve the existing relationship only when its original
     * opportunity record still exists.
     */

    if (isBelgiumLegacyApplication(application)) {
      const currentId = idString(application.opportunity);

      if (!existingIds.has(currentId)) {
        unmatched.push({
          applicationId: idString(application._id),

          currentOpportunityId: currentId,

          snapshotTitle: snapshot.title ?? null,

          destinationCountry: application.destinationCountry ?? null,

          reason: "BELGIUM_LEGACY_REFERENCE_NOT_FOUND",
        });

        continue;
      }

      preservedLegacyApplications.push({
        applicationId: idString(application._id),

        opportunityId: currentId,

        title: snapshot.title,

        country: application.destinationCountry,
      });

      continue;
    }

    /*
     * Every other unmatched or ambiguous application requires
     * manual review. Do not proceed with destructive operations.
     */

    unmatched.push({
      applicationId: idString(application._id),

      currentOpportunityId: idString(application.opportunity),

      snapshotTitle: snapshot.title ?? null,

      snapshotCountry: snapshot.countryName ?? null,

      snapshotCountrySlug: snapshot.countrySlug ?? null,

      destinationCountry: application.destinationCountry ?? null,

      reason:
        candidates.length === 0
          ? "NO_EXACT_SOURCE_MATCH"
          : "AMBIGUOUS_SOURCE_MATCH",
    });
  }

  return {
    plans,
    unmatched,
    preservedLegacyApplications,
  };
}

/* ==========================================================================
   VERIFY APPLICATION REFERENCES
   ========================================================================== */

async function verifyApplicationReferences() {
  const applications = await Application.find({})
    .select("_id opportunity")
    .lean();

  const opportunities = await Opportunity.find({}).select("_id").lean();

  const opportunityIds = new Set(
    opportunities.map((item) => idString(item._id)),
  );

  const brokenReferences = applications.filter(
    (application) => !opportunityIds.has(idString(application.opportunity)),
  );

  return {
    applications,
    opportunities,
    brokenReferences,
  };
}

/* ==========================================================================
   MAIN RESET
   ========================================================================== */

async function resetOpportunities() {
  const execute = process.argv.includes("--execute");

  let connected = false;

  /*
   * ENVIRONMENT CHECK
   */

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      `MongoDB connection string is missing. ` +
        `Expected MONGO_URI or MONGODB_URI in ${ENV_PATH}.`,
    );
  }

  console.log("\n========================================");
  console.log("COLOSSUS OPPORTUNITY CATALOGUE RESET");
  console.log("========================================");

  console.log("Environment file:", ENV_PATH);

  console.log("Mode:", execute ? "EXECUTION" : "PREVIEW");

  /*
   * CONNECT TO MONGODB
   */

  await mongoose.connect(mongoUri);

  connected = true;

  try {
    console.log("Connected database:", mongoose.connection.name);

    /*
     * SAFETY CHECK
     *
     * This reset was audited against the test database.
     * Never execute against another database accidentally.
     */

    if (mongoose.connection.name !== EXPECTED_DATABASE_NAME) {
      console.warn(
        `WARNING: Expected database "${EXPECTED_DATABASE_NAME}", ` +
          `but connected to "${mongoose.connection.name}".`,
      );

      if (execute) {
        throw new Error(
          "Execution stopped because the connected database " +
            "does not match the previously audited database.",
        );
      }
    }

    /*
     * VALIDATE SOURCE
     */

    const source = opportunitiesData;

    validateSource(source);

    /*
     * LOAD CURRENT DATABASE RECORDS
     */

    const existing = await Opportunity.find({}).lean();

    const applications = await Application.find({}).lean();

    console.log("Current opportunities:", existing.length);

    console.log("Current applications:", applications.length);

    console.log("Authoritative source offers:", source.length);

    /*
     * BUILD APPLICATION MATCHING PLAN
     *
     * No database writes occur during this stage.
     */

    const { plans, unmatched, preservedLegacyApplications } =
      buildApplicationPlan(applications, source, existing);

    console.log("Applications matched to new catalogue:", plans.length);

    console.log(
      "Historical applications to preserve:",
      preservedLegacyApplications.length,
    );

    console.log("Applications requiring manual review:", unmatched.length);

    /*
     * FAIL CLOSED IF ANY APPLICATION IS UNACCOUNTED FOR
     */

    if (unmatched.length > 0) {
      console.error("\nRESET ABORTED.");

      console.table(unmatched);

      console.error("No database writes were performed.");

      return;
    }

    /*
     * VERIFY EVERY MATCH TARGET EXISTS IN THE SOURCE
     */

    const sourceKeys = new Set(source.map(sourceKey));

    for (const plan of plans) {
      if (!sourceKeys.has(plan.sourceKey)) {
        throw new Error(
          `Application plan references an unknown source key: ` +
            `${plan.sourceKey}`,
        );
      }
    }

    /*
     * IDENTIFY EXISTING DUPLICATE OPPORTUNITY IDENTITIES
     */

    const groups = groupByIdentity(existing);

    const duplicateGroups = [...groups.entries()]
      .filter(([, records]) => records.length > 1)
      .map(([key, records]) => ({
        key,

        recordIds: records.map((record) => idString(record._id)),

        count: records.length,
      }));

    console.log(
      "Duplicate identity groups to resolve:",
      duplicateGroups.length,
    );

    /*
     * CREATE REVIEW REPORT
     */

    const report = {
      generatedAt: new Date().toISOString(),

      database: mongoose.connection.name,

      mode: execute ? "EXECUTION" : "PREVIEW",

      existingOpportunityCount: existing.length,

      applicationCount: applications.length,

      sourceOpportunityCount: source.length,

      matchedApplicationCount: plans.length,

      preservedLegacyApplications,

      duplicateGroups,

      applicationPlans: plans.map((plan) => ({
        applicationId: idString(plan.applicationId),

        currentOpportunityId: plan.currentOpportunityId,

        matchedTitle: plan.matchedTitle,

        matchedCountry: plan.matchedCountry,

        sourceKey: plan.sourceKey,
      })),

      unmatchedApplications: unmatched,
    };

    /*
     * REPORT PATH IS RELATIVE TO backend/, NOT THE TERMINAL'S
     * CURRENT WORKING DIRECTORY.
     */

    await fs.writeFile(
      REVIEW_REPORT_PATH,
      JSON.stringify(report, null, 2),
      "utf8",
    );

    console.log("\nReview report:", REVIEW_REPORT_PATH);

    /*
     * PREVIEW MODE
     *
     * The default command never modifies MongoDB records.
     */

    if (!execute) {
      console.log("\n========================================");
      console.log("PREVIEW PASSED");
      console.log("========================================");

      console.log("Authoritative offers:", source.length);

      console.log("Applications matched:", plans.length);

      console.log(
        "Historical applications preserved:",
        preservedLegacyApplications.length,
      );

      console.log("Unmatched applications:", unmatched.length);

      console.log("Duplicate identity groups:", duplicateGroups.length);

      console.log("\nNo MongoDB records were changed.");

      console.log("Review the JSON report before execution.");

      return;
    }

    /*
     * EXECUTION SAFETY CHECKS
     */

    if (mongoose.connection.name !== EXPECTED_DATABASE_NAME) {
      throw new Error("Execution aborted: database safety check failed.");
    }

    /*
     * BACK UP FULL DOCUMENTS BEFORE THE FIRST WRITE
     */

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const backupDirectory = path.join(
      BACKEND_DIR,
      "backups",
      `opportunity-reset-${timestamp}`,
    );

    await fs.mkdir(backupDirectory, {
      recursive: true,
    });

    await fs.writeFile(
      path.join(backupDirectory, "opportunities.json"),
      JSON.stringify(existing, null, 2),
      "utf8",
    );

    await fs.writeFile(
      path.join(backupDirectory, "applications.json"),
      JSON.stringify(applications, null, 2),
      "utf8",
    );

    await fs.writeFile(
      path.join(backupDirectory, "reset-report.json"),
      JSON.stringify(report, null, 2),
      "utf8",
    );

    console.log("\nBackup created:", backupDirectory);

    /*
     * RESOLVE DUPLICATE IDENTITIES
     *
     * For each duplicate group:
     *
     * 1. Prefer the record referenced by a preserved legacy application.
     * 2. Otherwise, prefer the record referenced by the most applications.
     * 3. Repoint application references to the canonical record.
     * 4. Verify that duplicates are no longer referenced.
     * 5. Delete the duplicate records.
     *
     * Original documents are already backed up.
     */

    const currentApplicationReferences = await Application.find({})
      .select("_id opportunity")
      .lean();

    const referenceCounts = new Map();

    for (const application of currentApplicationReferences) {
      const key = idString(application.opportunity);

      referenceCounts.set(key, (referenceCounts.get(key) || 0) + 1);
    }

    const protectedLegacyIds = new Set(
      preservedLegacyApplications.map(
        (application) => application.opportunityId,
      ),
    );

    let duplicateRecordsRemoved = 0;

    for (const [key, records] of groups.entries()) {
      if (records.length <= 1) {
        continue;
      }

      const preservedRecord = records.find((record) =>
        protectedLegacyIds.has(idString(record._id)),
      );

      const rankedRecords = [...records].sort((a, b) => {
        const countA = referenceCounts.get(idString(a._id)) || 0;

        const countB = referenceCounts.get(idString(b._id)) || 0;

        return countB - countA;
      });

      const canonical = preservedRecord || rankedRecords[0];

      const duplicateIds = records
        .filter((record) => idString(record._id) !== idString(canonical._id))
        .map((record) => record._id);

      if (duplicateIds.length === 0) {
        continue;
      }

      /*
       * Move application references before deleting duplicates.
       */

      await Application.updateMany(
        {
          opportunity: {
            $in: duplicateIds,
          },
        },
        {
          $set: {
            opportunity: canonical._id,
          },
        },
      );

      /*
       * Confirm that no application still references these duplicates.
       */

      const stillReferenced = await Application.countDocuments({
        opportunity: {
          $in: duplicateIds,
        },
      });

      if (stillReferenced > 0) {
        throw new Error(
          `Could not safely resolve duplicate identity "${key}". ` +
            `${stillReferenced} application reference(s) remain.`,
        );
      }

      const deletion = await Opportunity.deleteMany({
        _id: {
          $in: duplicateIds,
        },
      });

      duplicateRecordsRemoved += deletion.deletedCount || 0;
    }

    /*
     * RUN THE AUTHORITATIVE SEEDER
     *
     * The seeder uses a default export.
     */

    console.log("\nRunning authoritative opportunity seeder...");

    const seederModule = await import("../seeders/opportunity.seeder.js");

    const seedOpportunities = seederModule.default;

    if (typeof seedOpportunities !== "function") {
      throw new Error("The default seedOpportunities export is missing.");
    }

    await seedOpportunities();

    /*
     * VERIFY THE 25 AUTHORITATIVE SOURCE IDENTITIES
     */

    const afterSeeding = await Opportunity.find({}).lean();

    const sourceKeySet = new Set(source.map(sourceKey));

    const seededByKey = new Map();

    for (const opportunity of afterSeeding) {
      const key = databaseKey(opportunity);

      if (!sourceKeySet.has(key)) {
        continue;
      }

      if (seededByKey.has(key)) {
        throw new Error(
          `Duplicate authoritative identity after seeding: ${key}`,
        );
      }

      seededByKey.set(key, opportunity);
    }

    if (seededByKey.size !== EXPECTED_SOURCE_COUNT) {
      throw new Error(
        `Expected ${EXPECTED_SOURCE_COUNT} authoritative records; ` +
          `found ${seededByKey.size}. Legacy cleanup was not performed.`,
      );
    }

    /*
     * RECONNECT MATCHED APPLICATIONS
     */

    const applicationUpdates = plans.map((plan) => {
      const target = seededByKey.get(plan.sourceKey);

      if (!target) {
        throw new Error(
          `Missing target opportunity for application ` +
            `${idString(plan.applicationId)}.`,
        );
      }

      return {
        updateOne: {
          filter: {
            _id: plan.applicationId,
          },

          update: {
            $set: {
              opportunity: target._id,
            },
          },
        },
      };
    });

    if (applicationUpdates.length > 0) {
      await Application.bulkWrite(applicationUpdates, {
        ordered: true,
      });
    }

    /*
     * VERIFY BELGIUM LEGACY APPLICATIONS
     *
     * Each protected application must still point to its original
     * historical opportunity ID.
     */

    for (const legacy of preservedLegacyApplications) {
      const refreshedApplication = await Application.findById(
        legacy.applicationId,
      )
        .select("_id opportunity")
        .lean();

      if (!refreshedApplication) {
        throw new Error(
          `Preserved application disappeared: ` + `${legacy.applicationId}`,
        );
      }

      if (idString(refreshedApplication.opportunity) !== legacy.opportunityId) {
        throw new Error(
          `Historical opportunity reference changed for Belgium ` +
            `application ${legacy.applicationId}.`,
        );
      }

      const historicalOpportunityExists = await Opportunity.exists({
        _id: legacy.opportunityId,
      });

      if (!historicalOpportunityExists) {
        throw new Error(
          `Historical Belgium opportunity no longer exists: ` +
            `${legacy.opportunityId}`,
        );
      }
    }

    /*
     * VERIFY ALL APPLICATION REFERENCES BEFORE CLEANUP
     */

    const { applications: refreshedApplications, brokenReferences } =
      await verifyApplicationReferences();

    if (refreshedApplications.length !== applications.length) {
      throw new Error(
        `Application count changed from ${applications.length} ` +
          `to ${refreshedApplications.length}.`,
      );
    }

    if (brokenReferences.length > 0) {
      throw new Error(
        `${brokenReferences.length} application reference(s) ` +
          `do not resolve. Legacy cleanup was not performed.`,
      );
    }

    /*
     * DELETE ONLY OBSOLETE, UNREFERENCED OPPORTUNITIES
     *
     * Keep:
     * - All 25 authoritative opportunities.
     * - Every opportunity referenced by an application.
     *
     * This protects the Belgium historical opportunity.
     */

    const authoritativeIds = [...seededByKey.values()].map(
      (opportunity) => opportunity._id,
    );

    const referencedIds = refreshedApplications.map(
      (application) => application.opportunity,
    );

    const keepIds = [
      ...new Map(
        [...authoritativeIds, ...referencedIds].map((id) => [idString(id), id]),
      ).values(),
    ];

    const deletionResult = await Opportunity.deleteMany({
      _id: {
        $nin: keepIds,
      },
    });

    /*
     * FINAL VERIFICATION
     */

    const finalOpportunities = await Opportunity.find({}).lean();

    const finalApplications = await Application.find({})
      .select("_id opportunity")
      .lean();

    /*
     * Exactly 25 authoritative source identities must remain.
     */

    const finalSourceMatches = finalOpportunities.filter((opportunity) =>
      sourceKeySet.has(databaseKey(opportunity)),
    );

    const finalKeys = finalSourceMatches.map(databaseKey);

    const finalUniqueKeys = new Set(finalKeys);

    if (
      finalSourceMatches.length !== EXPECTED_SOURCE_COUNT ||
      finalUniqueKeys.size !== EXPECTED_SOURCE_COUNT
    ) {
      throw new Error(
        "Final verification failed: the authoritative catalogue " +
          "does not contain exactly 25 unique source identities.",
      );
    }

    /*
     * Every application must still reference an existing opportunity.
     */

    const finalIds = new Set(
      finalOpportunities.map((opportunity) => idString(opportunity._id)),
    );

    const finalBrokenReferences = finalApplications.filter(
      (application) => !finalIds.has(idString(application.opportunity)),
    );

    if (finalBrokenReferences.length > 0) {
      throw new Error(
        `Final verification failed: ` +
          `${finalBrokenReferences.length} application references are broken.`,
      );
    }

    /*
     * The application count must not change.
     */

    if (finalApplications.length !== applications.length) {
      throw new Error("Final verification failed: application count changed.");
    }

    /*
     * VERIFY THE BELGIUM REFERENCE ONE FINAL TIME
     */

    for (const legacy of preservedLegacyApplications) {
      const finalApplication = finalApplications.find(
        (application) => idString(application._id) === legacy.applicationId,
      );

      if (
        !finalApplication ||
        idString(finalApplication.opportunity) !== legacy.opportunityId
      ) {
        throw new Error(
          `Final Belgium verification failed for application ` +
            `${legacy.applicationId}.`,
        );
      }
    }

    /*
     * SUCCESS
     */

    console.log("\n========================================");
    console.log("RESET COMPLETED");
    console.log("========================================");

    console.log("Authoritative opportunities:", finalSourceMatches.length);

    console.log(
      "Total opportunity records, including preserved history:",
      finalOpportunities.length,
    );

    console.log("Applications preserved:", finalApplications.length);

    console.log(
      "Historical Belgium applications preserved:",
      preservedLegacyApplications.length,
    );

    console.log("Duplicate records resolved:", duplicateRecordsRemoved);

    console.log(
      "Unreferenced legacy opportunities deleted:",
      deletionResult.deletedCount || 0,
    );

    console.log("Backup directory:", backupDirectory);

    console.log("\nAll application references resolve.");

    console.log("All protected Belgium references remain unchanged.");
  } finally {
    if (connected) {
      await mongoose.disconnect();
    }
  }
}

/* ==========================================================================
   EXECUTION
   ========================================================================== */

resetOpportunities().catch((error) => {
  console.error("\nOPPORTUNITY RESET FAILED");

  console.error(error);

  process.exitCode = 1;
});
