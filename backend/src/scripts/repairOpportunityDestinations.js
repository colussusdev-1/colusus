/**
 * Repair Opportunity Destination Metadata
 *
 * Default:
 *   READ-ONLY preview
 *
 * Run:
 *   node src/scripts/repairOpportunityDestinations.js
 *
 * Apply approved changes:
 *   node src/scripts/repairOpportunityDestinations.js --apply
 *
 * Safety:
 * - Only permits the explicitly configured database.
 * - Verifies the original record before updating.
 * - Preserves MongoDB _id and unrelated fields.
 * - Detects and reports unique slug collisions.
 * - Never deletes or merges opportunities.
 * - Writes a JSON report.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import Opportunity from "../modules/opportunities/opportunity.model.js";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_ROOT = path.resolve(__dirname, "../..");

dotenv.config({
  path: path.join(BACKEND_ROOT, ".env"),
});

const APPLY_CHANGES = process.argv.includes("--apply");

const EXPECTED_DATABASE = "test";

const REPORT_PATH = path.join(
  BACKEND_ROOT,
  "opportunity-destination-repair-report.json",
);

/* -------------------------------------------------------------------------- */
/* APPROVED REPAIRS                                                           */
/* -------------------------------------------------------------------------- */

/**
 * This is the only repair currently configured.
 *
 * The record is expected to be a Hungary offer with incorrect Australian
 * destination metadata.
 *
 * countryId and countryImage are intentionally excluded until verified.
 */

const REPAIRS = [
  {
    label: "Hungary Flexible Work Permit Package",

    id: "6a7b4496a4b4f12a3141a9ab",

    expectedOriginal: {
      title: "Hungary Flexible Work Permit Package",
      countryName: "Australia",
      countrySlug: "australia",
      countryFlag: "🇦🇺",
    },

    set: {
      countryName: "Hungary",
      countrySlug: "hungary",
      countryFlag: "🇭🇺",

      countryDescription:
        "Explore work permit and residence opportunities in Hungary.",

      countryVisa: "Work Permit + Residence Card (TRC)",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function log(message) {
  console.log(`\n${message}`);
}

function sameValue(actual, expected) {
  return String(actual ?? "") === String(expected ?? "");
}

function serializeOpportunity(opportunity) {
  if (!opportunity) {
    return null;
  }

  return {
    id: String(opportunity._id),
    title: opportunity.title,
    slug: opportunity.slug,

    countryId: opportunity.countryId,
    countryName: opportunity.countryName,
    countrySlug: opportunity.countrySlug,
    countryFlag: opportunity.countryFlag,
    countryImage: opportunity.countryImage,

    location: opportunity.location,
    active: opportunity.active,
  };
}

/* -------------------------------------------------------------------------- */
/* REPAIR INSPECTION                                                          */
/* -------------------------------------------------------------------------- */

async function inspectRepair(repair) {
  const result = {
    label: repair.label,
    id: repair.id,
    status: "PENDING",
    changes: [],
  };

  /* ---------------------------------------------------------------------- */
  /* 1. FIND THE TARGET RECORD                                               */
  /* ---------------------------------------------------------------------- */

  const opportunity = await Opportunity.findById(repair.id).lean();

  if (!opportunity) {
    result.status = "SKIPPED_RECORD_NOT_FOUND";

    result.message = "No opportunity was found with the specified MongoDB _id.";

    return result;
  }

  result.currentRecord = serializeOpportunity(opportunity);

  /* ---------------------------------------------------------------------- */
  /* 2. VERIFY THE ORIGINAL RECORD                                          */
  /* ---------------------------------------------------------------------- */

  const mismatches = [];

  for (const [field, expected] of Object.entries(repair.expectedOriginal)) {
    if (!sameValue(opportunity[field], expected)) {
      mismatches.push({
        field,
        expected,
        actual: opportunity[field] ?? null,
      });
    }
  }

  if (mismatches.length > 0) {
    result.status = "SKIPPED_ORIGINAL_DATA_MISMATCH";

    result.mismatches = mismatches;

    result.message =
      "The current record differs from the reviewed original. No changes were made.";

    return result;
  }

  /* ---------------------------------------------------------------------- */
  /* 3. CHECK THE UNIQUE COUNTRY + OFFER SLUG                                */
  /* ---------------------------------------------------------------------- */

  const targetCountrySlug = repair.set.countrySlug;

  const collision = await Opportunity.findOne({
    _id: {
      $ne: opportunity._id,
    },

    countrySlug: targetCountrySlug,

    slug: opportunity.slug,
  })
    .select(
      "_id title slug countryId countryName countrySlug countryFlag location active",
    )
    .lean();

  if (collision) {
    result.status = "SKIPPED_UNIQUE_SLUG_COLLISION";

    result.collision = serializeOpportunity(collision);

    result.message =
      "Another opportunity already uses this countrySlug + slug combination. No changes were made.";

    log("CONFLICTING OPPORTUNITY FOUND");

    console.log(
      JSON.stringify(
        {
          target: serializeOpportunity(opportunity),

          conflictingOpportunity: serializeOpportunity(collision),

          conflictReason:
            "Both records would use the same countrySlug and offer slug.",

          action:
            "No record was modified. Review both opportunities before deciding whether a slug needs correction.",
        },
        null,
        2,
      ),
    );

    return result;
  }

  /* ---------------------------------------------------------------------- */
  /* 4. CALCULATE THE PROPOSED CHANGES                                       */
  /* ---------------------------------------------------------------------- */

  for (const [field, newValue] of Object.entries(repair.set)) {
    const oldValue = opportunity[field] ?? null;

    if (!sameValue(oldValue, newValue)) {
      result.changes.push({
        field,
        from: oldValue,
        to: newValue,
      });
    }
  }

  if (result.changes.length === 0) {
    result.status = "ALREADY_CORRECT";

    result.message = "All approved destination fields already match.";

    return result;
  }

  /* ---------------------------------------------------------------------- */
  /* 5. PREVIEW MODE                                                         */
  /* ---------------------------------------------------------------------- */

  if (!APPLY_CHANGES) {
    result.status = "PREVIEW_ONLY";

    result.message = "Preview only. MongoDB was not modified.";

    return result;
  }

  /* ---------------------------------------------------------------------- */
  /* 6. CONDITIONAL UPDATE                                                   */
  /* ---------------------------------------------------------------------- */

  /**
   * The update will only match the original record if its identifying
   * destination fields have not changed since inspection.
   *
   * Only fields inside repair.set are modified.
   */

  const filter = {
    _id: opportunity._id,

    title: repair.expectedOriginal.title,

    countryName: repair.expectedOriginal.countryName,

    countrySlug: repair.expectedOriginal.countrySlug,

    countryFlag: repair.expectedOriginal.countryFlag,
  };

  const updateResult = await Opportunity.updateOne(
    filter,
    {
      $set: repair.set,
    },
    {
      runValidators: true,
    },
  );

  const matchedCount = updateResult.matchedCount ?? updateResult.n ?? 0;

  if (matchedCount !== 1) {
    result.status = "SKIPPED_CONCURRENT_CHANGE";

    result.message =
      "The record no longer matches the expected original values. No update was applied.";

    result.updateResult = updateResult;

    return result;
  }

  /* ---------------------------------------------------------------------- */
  /* 7. VERIFY THE UPDATED RECORD                                            */
  /* ---------------------------------------------------------------------- */

  const updated = await Opportunity.findById(repair.id).lean();

  if (!updated) {
    result.status = "UPDATE_REQUIRES_REVIEW";

    result.message =
      "The update matched the record, but the record could not be retrieved afterward.";

    return result;
  }

  const verificationFailures = [];

  for (const [field, expected] of Object.entries(repair.set)) {
    if (!sameValue(updated[field], expected)) {
      verificationFailures.push({
        field,
        expected,
        actual: updated[field] ?? null,
      });
    }
  }

  if (verificationFailures.length > 0) {
    result.status = "UPDATE_REQUIRES_REVIEW";

    result.verificationFailures = verificationFailures;

    result.message =
      "Post-update verification failed. Inspect the record before making further changes.";

    result.after = serializeOpportunity(updated);

    return result;
  }

  result.status = "APPLIED_AND_VERIFIED";

  result.message =
    "Approved destination metadata updated and verified successfully.";

  result.after = serializeOpportunity(updated);

  return result;
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MongoDB URI not found. Check MONGO_URI or MONGODB_URI in backend/.env.",
    );
  }

  log("OPPORTUNITY DESTINATION REPAIR");

  console.log(`Mode: ${APPLY_CHANGES ? "APPLY CHANGES" : "READ-ONLY PREVIEW"}`);

  console.log(`Expected database: ${EXPECTED_DATABASE}`);

  console.log(`Repairs configured: ${REPAIRS.length}`);

  /* ---------------------------------------------------------------------- */
  /* CONNECT                                                                 */
  /* ---------------------------------------------------------------------- */

  await mongoose.connect(mongoUri);

  const actualDatabase = mongoose.connection.name;

  console.log(`Connected database: ${actualDatabase}`);

  /**
   * Fail closed if the connection resolves to an unexpected database.
   */

  if (actualDatabase !== EXPECTED_DATABASE) {
    throw new Error(
      `Safety stop: connected to "${actualDatabase}", but this script only permits "${EXPECTED_DATABASE}". No repairs were applied.`,
    );
  }

  /* ---------------------------------------------------------------------- */
  /* REPORT                                                                  */
  /* ---------------------------------------------------------------------- */

  const report = {
    generatedAt: new Date().toISOString(),

    mode: APPLY_CHANGES ? "APPLY" : "PREVIEW",

    database: actualDatabase,

    repairs: [],
  };

  /* ---------------------------------------------------------------------- */
  /* PROCESS EACH APPROVED REPAIR                                            */
  /* ---------------------------------------------------------------------- */

  for (const repair of REPAIRS) {
    log(`Checking: ${repair.label}`);

    try {
      const result = await inspectRepair(repair);

      report.repairs.push(result);

      console.log(`Status: ${result.status}`);

      if (result.message) {
        console.log(result.message);
      }

      if (result.changes?.length > 0) {
        console.log("\nProposed or applied field changes:");

        console.table(result.changes);
      }

      if (result.mismatches?.length > 0) {
        console.log("\nOriginal record mismatches:");

        console.table(result.mismatches);
      }

      if (result.collision) {
        console.log("\nCollision details:");

        console.table([result.collision]);
      }

      if (result.verificationFailures?.length > 0) {
        console.log("\nVerification failures:");

        console.table(result.verificationFailures);
      }
    } catch (error) {
      const result = {
        label: repair.label,

        id: repair.id,

        status: "ERROR",

        message: error.message,
      };

      report.repairs.push(result);

      console.error("Repair failed:", error.message);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* SAVE REPORT                                                             */
  /* ---------------------------------------------------------------------- */

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  /* ---------------------------------------------------------------------- */
  /* SUMMARY                                                                 */
  /* ---------------------------------------------------------------------- */

  log("SUMMARY");

  console.table(
    report.repairs.map((item) => ({
      label: item.label,

      id: item.id,

      status: item.status,

      changes: item.changes?.length ?? 0,

      collision: item.collision ? item.collision.id : "",
    })),
  );

  console.log(`Report saved to: ${REPORT_PATH}`);

  /* ---------------------------------------------------------------------- */
  /* EXIT STATUS                                                             */
  /* ---------------------------------------------------------------------- */

  const failed = report.repairs.some((item) =>
    ["ERROR", "UPDATE_REQUIRES_REVIEW", "SKIPPED_CONCURRENT_CHANGE"].includes(
      item.status,
    ),
  );

  if (failed) {
    process.exitCode = 1;
  }
}

/* -------------------------------------------------------------------------- */
/* EXECUTION                                                                  */
/* -------------------------------------------------------------------------- */

main()
  .catch((error) => {
    console.error("\nSAFETY STOP:", error.message);

    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
