import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";

import Opportunity from "../modules/opportunities/opportunity.model.js";
import Application from "../modules/applications/application.model.js";

dotenv.config();

/* ==========================================================================
   COLUSSUS — OPPORTUNITY INTEGRITY AUDIT

   MODE: READ ONLY

   This script:
   - Reads existing opportunities and applications.
   - Identifies country ID collisions.
   - Flags conflicting destination metadata.
   - Detects duplicate country/slug combinations.
   - Checks application opportunity references.
   - Reports application snapshot differences.
   - Exports JSON and CSV reports locally.

   It does NOT:
   - Update MongoDB records.
   - Delete records.
   - Create or reseed opportunities.
   - Change application references.
   ========================================================================== */

/* ==========================================================================
   HELPERS
   ========================================================================== */

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const slugify = (value) => normalize(value).replace(/\s+/g, "-");

const idString = (value) =>
  value === null || value === undefined ? "" : String(value);

const unique = (values) => [...new Set(values.filter(Boolean))];

const escapeCsv = (value) => {
  const text = Array.isArray(value) ? value.join(";") : String(value ?? "");

  return `"${text.replace(/"/g, '""')}"`;
};

/* ==========================================================================
   MAIN AUDIT
   ========================================================================== */

async function runAudit() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the environment variables.");
  }

  console.log("\n================================================");
  console.log("COLUSSUS OPPORTUNITY INTEGRITY AUDIT");
  console.log("================================================\n");

  console.log("Connecting to MongoDB...");

  await mongoose.connect(mongoUri);

  console.log("Connected successfully.");
  console.log("Database:", mongoose.connection.name);
  console.log("Mode: READ ONLY");
  console.log("No MongoDB records will be modified.\n");

  try {
    /* ======================================================================
       1. LOAD OPPORTUNITIES
       ====================================================================== */

    console.log("Loading opportunities...");

    const opportunities = await Opportunity.find({}).lean().exec();

    console.log(`Loaded ${opportunities.length} opportunities.`);

    /* ======================================================================
       2. LOAD APPLICATIONS
       ====================================================================== */

    console.log("Loading applications...");

    const applications = await Application.find({})
      .select("_id user opportunity opportunitySnapshot status createdAt")
      .lean()
      .exec();

    console.log(`Loaded ${applications.length} applications.\n`);

    /* ======================================================================
       3. PREPARE LOOKUPS
       ====================================================================== */

    const opportunityById = new Map(
      opportunities.map((opportunity) => [
        idString(opportunity._id),
        opportunity,
      ]),
    );

    /*
     * Build this list once.
     * Country names are used only to flag suspicious records.
     * They are not treated as authoritative correction instructions.
     */

    const allCountryNames = unique(
      opportunities.map((opportunity) =>
        String(opportunity.countryName ?? "").trim(),
      ),
    );

    /* ======================================================================
       4. COUNTRY ID COLLISIONS
       ====================================================================== */

    const countryIdGroups = new Map();

    for (const opportunity of opportunities) {
      const countryId = opportunity.countryId;

      if (countryId === undefined || countryId === null) {
        continue;
      }

      if (!countryIdGroups.has(countryId)) {
        countryIdGroups.set(countryId, {
          countryId,
          countries: new Set(),
          countrySlugs: new Set(),
          opportunityIds: [],
        });
      }

      const group = countryIdGroups.get(countryId);

      if (opportunity.countryName) {
        group.countries.add(opportunity.countryName.trim());
      }

      if (opportunity.countrySlug) {
        group.countrySlugs.add(opportunity.countrySlug.trim());
      }

      group.opportunityIds.push(idString(opportunity._id));
    }

    const countryIdCollisions = [...countryIdGroups.values()]
      .filter(
        (group) => group.countries.size > 1 || group.countrySlugs.size > 1,
      )
      .map((group) => ({
        countryId: group.countryId,
        countries: [...group.countries],
        countrySlugs: [...group.countrySlugs],
        opportunityCount: group.opportunityIds.length,
        opportunityIds: group.opportunityIds,
      }));

    /* ======================================================================
       5. DESTINATION METADATA CONFLICTS
       ====================================================================== */

    const destinationConflicts = [];

    const missingDestinationFields = [];

    for (const opportunity of opportunities) {
      const title = normalize(opportunity.title);

      const description = normalize(opportunity.description);

      const location = normalize(opportunity.location);

      const countryName = normalize(opportunity.countryName);

      const countrySlug = normalize(opportunity.countrySlug);

      const reasons = [];

      /* --------------------------------------------------------------
         Required destination fields
         -------------------------------------------------------------- */

      const missingFields = [];

      if (!opportunity.countryId && opportunity.countryId !== 0) {
        missingFields.push("countryId");
      }

      if (!opportunity.countryName?.trim()) {
        missingFields.push("countryName");
      }

      if (!opportunity.countrySlug?.trim()) {
        missingFields.push("countrySlug");
      }

      if (!opportunity.title?.trim()) {
        missingFields.push("title");
      }

      if (!opportunity.slug?.trim()) {
        missingFields.push("slug");
      }

      if (missingFields.length > 0) {
        missingDestinationFields.push({
          opportunityId: idString(opportunity._id),
          title: opportunity.title ?? "",
          missingFields,
        });

        reasons.push("REQUIRED_FIELDS_MISSING");
      }

      /* --------------------------------------------------------------
         Location and country metadata disagree
         -------------------------------------------------------------- */

      const locationSlug = slugify(opportunity.location);

      if (
        location &&
        countryName &&
        location !== countryName &&
        locationSlug !== countrySlug
      ) {
        reasons.push("LOCATION_DIFFERS_FROM_COUNTRY_METADATA");
      }

      /* --------------------------------------------------------------
         Title mentions another known country
         -------------------------------------------------------------- */

      const conflictingTitleCountries = allCountryNames.filter((name) => {
        const candidate = normalize(name);

        if (!candidate || candidate.length <= 2 || candidate === countryName) {
          return false;
        }

        return title.includes(candidate);
      });

      if (conflictingTitleCountries.length > 0) {
        reasons.push("TITLE_CONTAINS_OTHER_KNOWN_COUNTRY_NAME");
      }

      /* --------------------------------------------------------------
         Location or description mentions another known country
         -------------------------------------------------------------- */

      const otherCountriesInDescription = allCountryNames.filter((name) => {
        const candidate = normalize(name);

        if (!candidate || candidate.length <= 2 || candidate === countryName) {
          return false;
        }

        return location.includes(candidate) || description.includes(candidate);
      });

      if (otherCountriesInDescription.length > 0) {
        reasons.push("DESCRIPTION_OR_LOCATION_MENTIONS_OTHER_COUNTRY");
      }

      /* --------------------------------------------------------------
         Save suspicious records for review
         -------------------------------------------------------------- */

      if (reasons.length > 0) {
        destinationConflicts.push({
          opportunityId: idString(opportunity._id),

          title: opportunity.title ?? "",

          slug: opportunity.slug ?? "",

          countryId: opportunity.countryId ?? null,

          countryName: opportunity.countryName ?? "",

          countrySlug: opportunity.countrySlug ?? "",

          countryFlag: opportunity.countryFlag ?? "",

          location: opportunity.location ?? "",

          conflictingTitleCountries,

          otherCountriesInDescription,

          reasons,
        });
      }
    }

    /* ======================================================================
       6. DUPLICATE COUNTRY AND OFFER SLUGS
       ====================================================================== */

    const offerKeyGroups = new Map();

    for (const opportunity of opportunities) {
      const key = [
        normalize(opportunity.countrySlug),
        normalize(opportunity.slug),
      ].join("::");

      if (!offerKeyGroups.has(key)) {
        offerKeyGroups.set(key, []);
      }

      offerKeyGroups.get(key).push({
        opportunityId: idString(opportunity._id),

        title: opportunity.title,

        countrySlug: opportunity.countrySlug,

        slug: opportunity.slug,
      });
    }

    const duplicateOfferKeys = [...offerKeyGroups.entries()]
      .filter(([, records]) => records.length > 1)
      .map(([key, records]) => ({
        key,
        records,
      }));

    /* ======================================================================
       7. APPLICATION REFERENCES
       ====================================================================== */

    const applicationsByOpportunity = new Map();

    const missingOpportunityReferences = [];

    const snapshotDifferences = [];

    for (const application of applications) {
      const applicationId = idString(application._id);

      const opportunityId = idString(application.opportunity);

      if (!opportunityId) {
        missingOpportunityReferences.push({
          applicationId,

          opportunityId: null,

          reason: "MISSING_OPPORTUNITY_REFERENCE",
        });

        continue;
      }

      const opportunity = opportunityById.get(opportunityId);

      if (!opportunity) {
        missingOpportunityReferences.push({
          applicationId,

          opportunityId,

          reason: "REFERENCED_OPPORTUNITY_NOT_FOUND",
        });

        continue;
      }

      if (!applicationsByOpportunity.has(opportunityId)) {
        applicationsByOpportunity.set(opportunityId, []);
      }

      applicationsByOpportunity.get(opportunityId).push({
        applicationId,

        status: application.status ?? null,
      });

      /* --------------------------------------------------------------
         Compare snapshot with current opportunity
         -------------------------------------------------------------- */

      const snapshot = application.opportunitySnapshot ?? {};

      const differences = [];

      for (const field of [
        "title",
        "countryName",
        "countrySlug",
        "countryFlag",
      ]) {
        const snapshotValue = normalize(snapshot[field]);

        const currentValue = normalize(opportunity[field]);

        if (snapshotValue && currentValue && snapshotValue !== currentValue) {
          differences.push({
            field,

            snapshotValue: snapshot[field],

            currentValue: opportunity[field],
          });
        }
      }

      if (differences.length > 0) {
        snapshotDifferences.push({
          applicationId,

          opportunityId,

          differences,

          note: "Historical snapshot difference. Review before deciding whether any correction is necessary.",
        });
      }
    }

    /* ======================================================================
       8. OPPORTUNITY INVENTORY
       ====================================================================== */

    const opportunityInventory = opportunities.map((opportunity) => {
      const relatedApplications =
        applicationsByOpportunity.get(idString(opportunity._id)) ?? [];

      return {
        _id: idString(opportunity._id),

        title: opportunity.title ?? "",

        slug: opportunity.slug ?? "",

        countryId: opportunity.countryId ?? null,

        countryName: opportunity.countryName ?? "",

        countrySlug: opportunity.countrySlug ?? "",

        countryFlag: opportunity.countryFlag ?? "",

        location: opportunity.location ?? "",

        category: opportunity.category ?? "",

        active: opportunity.active ?? false,

        applicationCount: relatedApplications.length,

        applicationIds: relatedApplications.map(
          (application) => application.applicationId,
        ),
      };
    });

    /* ======================================================================
       9. APPLICATION INVENTORY
       ====================================================================== */

    const applicationInventory = applications.map((application) => {
      const opportunityId = idString(application.opportunity);

      const opportunity = opportunityById.get(opportunityId);

      return {
        applicationId: idString(application._id),

        userId: idString(application.user),

        opportunityId: opportunityId || null,

        opportunityExists: Boolean(opportunity),

        opportunityTitle: opportunity?.title ?? null,

        currentCountryName: opportunity?.countryName ?? null,

        currentCountrySlug: opportunity?.countrySlug ?? null,

        snapshotCountryName:
          application.opportunitySnapshot?.countryName ?? null,

        snapshotCountrySlug:
          application.opportunitySnapshot?.countrySlug ?? null,

        status: application.status ?? null,

        createdAt: application.createdAt ?? null,
      };
    });

    /* ======================================================================
       10. SUMMARY
       ====================================================================== */

    const report = {
      generatedAt: new Date().toISOString(),

      database: mongoose.connection.name,

      mode: "READ_ONLY",

      summary: {
        opportunities: opportunities.length,

        applications: applications.length,

        countryIdCollisions: countryIdCollisions.length,

        destinationConflicts: destinationConflicts.length,

        missingDestinationFields: missingDestinationFields.length,

        duplicateOfferKeys: duplicateOfferKeys.length,

        missingOpportunityReferences: missingOpportunityReferences.length,

        snapshotDifferences: snapshotDifferences.length,
      },

      countryIdCollisions,

      destinationConflicts,

      missingDestinationFields,

      duplicateOfferKeys,

      missingOpportunityReferences,

      snapshotDifferences,

      opportunityInventory,

      applicationInventory,
    };

    /* ======================================================================
       11. EXPORT REPORTS
       ====================================================================== */

    const reportDirectory = path.resolve(process.cwd(), "audit-reports");

    await fs.mkdir(reportDirectory, {
      recursive: true,
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const jsonPath = path.join(
      reportDirectory,
      `opportunity-integrity-${timestamp}.json`,
    );

    const opportunityCsvPath = path.join(
      reportDirectory,
      `opportunity-inventory-${timestamp}.csv`,
    );

    const applicationCsvPath = path.join(
      reportDirectory,
      `application-inventory-${timestamp}.csv`,
    );

    /* --------------------------------------------------------------
       JSON report
       -------------------------------------------------------------- */

    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");

    /* --------------------------------------------------------------
       Opportunity CSV
       -------------------------------------------------------------- */

    const opportunityColumns = [
      "_id",
      "title",
      "slug",
      "countryId",
      "countryName",
      "countrySlug",
      "countryFlag",
      "location",
      "category",
      "active",
      "applicationCount",
      "applicationIds",
    ];

    const opportunityCsv = [
      opportunityColumns.join(","),

      ...opportunityInventory.map((row) =>
        opportunityColumns.map((column) => escapeCsv(row[column])).join(","),
      ),
    ].join("\n");

    await fs.writeFile(opportunityCsvPath, opportunityCsv, "utf8");

    /* --------------------------------------------------------------
       Application CSV
       -------------------------------------------------------------- */

    const applicationColumns = [
      "applicationId",
      "userId",
      "opportunityId",
      "opportunityExists",
      "opportunityTitle",
      "currentCountryName",
      "currentCountrySlug",
      "snapshotCountryName",
      "snapshotCountrySlug",
      "status",
      "createdAt",
    ];

    const applicationCsv = [
      applicationColumns.join(","),

      ...applicationInventory.map((row) =>
        applicationColumns.map((column) => escapeCsv(row[column])).join(","),
      ),
    ].join("\n");

    await fs.writeFile(applicationCsvPath, applicationCsv, "utf8");

    /* ======================================================================
       12. TERMINAL SUMMARY
       ====================================================================== */

    console.log("\n================================================");
    console.log("AUDIT SUMMARY");
    console.log("================================================\n");

    console.table(report.summary);

    console.log("\nCOUNTRY ID COLLISIONS");
    console.log("--------------------------------");

    if (countryIdCollisions.length > 0) {
      console.table(
        countryIdCollisions.map((item) => ({
          countryId: item.countryId,

          countries: item.countries.join(", "),

          slugs: item.countrySlugs.join(", "),

          opportunities: item.opportunityCount,
        })),
      );
    } else {
      console.log("No country ID collisions detected.");
    }

    console.log("\nDESTINATION CONFLICTS");
    console.log("--------------------------------");

    if (destinationConflicts.length > 0) {
      console.table(
        destinationConflicts.map((item) => ({
          opportunityId: item.opportunityId,

          title: item.title,

          countryId: item.countryId,

          countryName: item.countryName,

          countrySlug: item.countrySlug,

          location: item.location,

          reasons: item.reasons.join(", "),
        })),
      );
    } else {
      console.log("No destination conflicts detected by these heuristics.");
    }

    console.log("\nAPPLICATION REFERENCE ISSUES");
    console.log("--------------------------------");

    if (missingOpportunityReferences.length > 0) {
      console.table(missingOpportunityReferences);
    } else {
      console.log("All application opportunity references resolve.");
    }

    console.log("\nREPORTS CREATED");
    console.log("--------------------------------");

    console.log("JSON:", jsonPath);

    console.log("Opportunities CSV:", opportunityCsvPath);

    console.log("Applications CSV:", applicationCsvPath);

    console.log("\nAUDIT COMPLETE.");

    console.log("No MongoDB records were modified.");

    console.log(
      "Destination conflict flags are review candidates, not automatic corrections.",
    );
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB connection closed.");
  }
}


/* ==========================================================================
   EXECUTION
   ========================================================================== */

runAudit().catch((error) => {
  console.error("\nOPPORTUNITY AUDIT FAILED.");

  console.error(error);

  process.exitCode = 1;
});
