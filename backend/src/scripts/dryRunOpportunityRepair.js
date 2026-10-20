import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import Opportunity from "../modules/opportunities/opportunity.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_ROOT = path.resolve(__dirname, "../..");
const ENV_PATH = path.join(BACKEND_ROOT, ".env");

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const normalizeCountryId = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isSafeInteger(number) && number > 0 ? number : null;
};

const createDestinationKey = (record) =>
  `${normalizeText(record.countryName)}::${slugify(record.countrySlug)}`;

const hasConsistentNameAndSlug = (record) => {
  const nameSlug = slugify(record.countryName);
  const countrySlug = slugify(record.countrySlug);

  return Boolean(nameSlug && countrySlug && nameSlug === countrySlug);
};

const safeRecord = (record) => ({
  opportunityId: String(record._id),
  legacyId: record.legacyId ?? null,
  title: record.title ?? "",
  offerSlug: record.slug ?? "",
  active: record.active !== false,
  featured: record.featured === true,
  current: {
    countryId: record.countryId ?? null,
    countryName: record.countryName ?? "",
    countrySlug: record.countrySlug ?? "",
  },
});

const countValues = (records) => {
  const counts = new Map();

  for (const record of records) {
    const countryId = normalizeCountryId(record.countryId);

    if (countryId === null) continue;

    counts.set(countryId, (counts.get(countryId) || 0) + 1);
  }

  return [...counts.entries()].sort(
    (first, second) => second[1] - first[1] || first[0] - second[0],
  );
};

const addToMapArray = (map, key, value) => {
  if (!map.has(key)) map.set(key, []);

  map.get(key).push(value);
};

/* -------------------------------------------------------------------------- */
/* ENVIRONMENT                                                                */
/* -------------------------------------------------------------------------- */

function loadEnvironment() {
  const result = dotenv.config({
    path: ENV_PATH,
    override: false,
  });

  if (result.error) {
    throw new Error(`Unable to load backend/.env: ${result.error.message}`);
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      [
        "MongoDB connection string is missing.",
        `Environment file checked: ${ENV_PATH}`,
        "Expected either MONGODB_URI or MONGO_URI.",
        "Check the variable name in backend/.env.",
      ].join("\n"),
    );
  }

  return mongoUri;
}

/* -------------------------------------------------------------------------- */
/* MAIN DRY RUN                                                               */
/* -------------------------------------------------------------------------- */

async function main() {
  const mongoUri = loadEnvironment();

  console.log("Environment loaded.");
  console.log("Connecting to MongoDB...");

  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB.");
  console.log("Reading opportunity records...");

  const records = await Opportunity.find({})
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
        "featured",
        "createdAt",
        "updatedAt",
      ].join(" "),
    )
    .sort({ createdAt: -1 })
    .lean();

  /* ------------------------------------------------------------------------ */
  /* GROUP BY DESTINATION                                                     */
  /* ------------------------------------------------------------------------ */

  const destinationGroups = new Map();

  for (const record of records) {
    const key = createDestinationKey(record);

    if (!key || key === "::") continue;

    addToMapArray(destinationGroups, key, record);
  }

  /* ------------------------------------------------------------------------ */
  /* BUILD CROSS-DESTINATION COUNTRY ID COLLISIONS                            */
  /* ------------------------------------------------------------------------ */

  const countryIdGroups = new Map();

  for (const record of records) {
    const countryId = normalizeCountryId(record.countryId);

    if (countryId === null) continue;

    const destination = {
      countryName: String(record.countryName ?? "").trim(),
      countrySlug: slugify(record.countrySlug),
      destinationKey: createDestinationKey(record),
    };

    addToMapArray(countryIdGroups, countryId, destination);
  }

  const countryIdCollisions = [];

  for (const [countryId, entries] of countryIdGroups.entries()) {
    const uniqueDestinations = new Map();

    for (const entry of entries) {
      if (!entry.destinationKey || entry.destinationKey === "::") continue;

      if (!uniqueDestinations.has(entry.destinationKey)) {
        uniqueDestinations.set(entry.destinationKey, {
          countryName: entry.countryName,
          countrySlug: entry.countrySlug,
          offerCount: 0,
        });
      }

      uniqueDestinations.get(entry.destinationKey).offerCount += 1;
    }

    if (uniqueDestinations.size > 1) {
      countryIdCollisions.push({
        countryId,
        distinctDestinationCount: uniqueDestinations.size,
        destinations: [...uniqueDestinations.values()],
        warning:
          "This ID is assigned to multiple destination identities. Verify the authoritative country catalogue before changing records.",
      });
    }
  }

  countryIdCollisions.sort(
    (a, b) =>
      b.distinctDestinationCount - a.distinctDestinationCount ||
      a.countryId - b.countryId,
  );

  /* ------------------------------------------------------------------------ */
  /* CLASSIFY RECORDS                                                         */
  /* ------------------------------------------------------------------------ */

  const proposals = [];
  const manualReview = [];
  const unchanged = [];

  for (const record of records) {
    const current = safeRecord(record);
    const destinationKey = createDestinationKey(record);

    const sameDestinationRecords = destinationGroups.get(destinationKey) || [];

    const idCounts = countValues(sameDestinationRecords);

    const destinationSummary = {
      matchingDestinationRecords: sameDestinationRecords.length,

      countryIdFrequency: idCounts.map(([countryId, count]) => ({
        countryId,
        count,
      })),

      observedDestinationIds: [
        ...new Set(
          sameDestinationRecords
            .map((item) => normalizeCountryId(item.countryId))
            .filter((id) => id !== null),
        ),
      ],
    };

    /* Missing identity */

    if (!record.countryName || !record.countrySlug) {
      manualReview.push({
        ...current,
        reason:
          "Country name or slug is missing. The destination cannot be inferred safely.",
        destinationSummary,
      });

      continue;
    }

    /* Name/slug mismatch */

    if (!hasConsistentNameAndSlug(record)) {
      manualReview.push({
        ...current,
        reason:
          "Country name and slug do not match after normalization. Verify the intended destination manually.",
        destinationSummary,
      });

      continue;
    }

    /* Invalid IDs */

    if (normalizeCountryId(record.countryId) === null) {
      manualReview.push({
        ...current,
        reason:
          "The current country ID is missing or invalid. This script will not infer a replacement without stronger evidence.",
        destinationSummary,
      });

      continue;
    }

    /* No IDs to compare */

    if (idCounts.length === 0) {
      manualReview.push({
        ...current,
        reason:
          "No valid country ID exists among records for this destination.",
        destinationSummary,
      });

      continue;
    }

    /* Find the most common ID */

    const highestCount = idCounts[0][1];

    const tiedIds = idCounts.filter(([, count]) => count === highestCount);

    if (tiedIds.length !== 1) {
      manualReview.push({
        ...current,
        reason:
          "Multiple country IDs have the same highest frequency. No canonical ID was selected.",
        destinationSummary,
      });

      continue;
    }

    const proposedCountryId = idCounts[0][0];
    const currentCountryId = normalizeCountryId(record.countryId);

    /* Require multiple supporting records */

    if (highestCount < 2) {
      manualReview.push({
        ...current,
        reason:
          "Only one record supports the candidate country ID. More evidence is required.",
        destinationSummary,
      });

      continue;
    }

    /* Check whether the candidate ID is reused globally */

    const candidateCollision = countryIdCollisions.find(
      (collision) => collision.countryId === proposedCountryId,
    );

    if (candidateCollision) {
      manualReview.push({
        ...current,
        reason: `The most common ID (${proposedCountryId}) is also assigned to multiple destination identities. Its correctness cannot be established from frequency alone.`,
        destinationSummary,
        globalIdConflict: candidateCollision,
      });

      continue;
    }

    /* Propose a change only if the candidate is globally unambiguous */

    if (currentCountryId !== proposedCountryId) {
      proposals.push({
        ...current,

        proposed: {
          countryId: proposedCountryId,
          countryName: record.countryName,
          countrySlug: slugify(record.countrySlug),
        },

        changes: {
          countryId: {
            from: record.countryId ?? null,
            to: proposedCountryId,
          },
        },

        reason: `${highestCount} record(s) for this destination use countryId ${proposedCountryId}, and that ID is not reused by another observed destination identity. Verify against the authoritative country catalogue before applying this proposal.`,

        destinationSummary,
      });

      continue;
    }

    unchanged.push({
      opportunityId: String(record._id),
      title: record.title ?? "",
      destination: record.countryName,
      countryId: currentCountryId,

      reason:
        "The current ID matches the most common ID in this destination group. This does not independently prove that the ID is correct.",
    });
  }

  /* ------------------------------------------------------------------------ */
  /* REPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  const report = {
    generatedAt: new Date().toISOString(),

    mode: "DRY_RUN_ONLY",

    databaseWritesPerformed: false,

    totals: {
      offersScanned: records.length,
      proposedCountryIdChanges: proposals.length,
      manualReviewRequired: manualReview.length,
      unchangedByThisRule: unchanged.length,
      countryIdCollisions: countryIdCollisions.length,
    },

    safetyNotes: [
      "This script only reads MongoDB and writes a local JSON report.",
      "No opportunity records are updated, deleted, merged, or deactivated.",
      "Country ID frequency is a heuristic, not authoritative proof.",
      "IDs reused across multiple destination identities are flagged for review.",
      "Country names, slugs, images, and other metadata are not repaired.",
      "Potential duplicate offers are not deleted or merged.",
      "Verify all proposed changes against the authoritative destination catalogue before implementing repairs.",
    ],

    countryIdCollisions,

    proposals,

    manualReview,

    unchanged,
  };

  /* ------------------------------------------------------------------------ */
  /* SAVE REPORT                                                              */
  /* ------------------------------------------------------------------------ */

  const outputPath = path.resolve(
    process.cwd(),
    "opportunity-repair-dry-run.json",
  );

  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  console.log("\nOPPORTUNITY REPAIR DRY RUN COMPLETE");
  console.log("===================================");
  console.log(`Offers scanned: ${report.totals.offersScanned}`);
  console.log(
    `Country ID proposals: ${report.totals.proposedCountryIdChanges}`,
  );
  console.log(`Manual review: ${report.totals.manualReviewRequired}`);
  console.log(`Unchanged by this rule: ${report.totals.unchangedByThisRule}`);
  console.log(
    `Cross-destination ID conflicts: ${report.totals.countryIdCollisions}`,
  );
  console.log("MongoDB writes: NONE");
  console.log(`Report saved to: ${outputPath}\n`);
}

/* -------------------------------------------------------------------------- */
/* RUN                                                                        */
/* -------------------------------------------------------------------------- */

main()
  .catch((error) => {
    console.error("Opportunity repair dry run failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
