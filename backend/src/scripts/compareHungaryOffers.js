import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import Opportunity from "../modules/opportunities/opportunity.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, "../..");

dotenv.config({
  path: path.join(BACKEND_ROOT, ".env"),
});

const EXPECTED_DATABASE = "test";

const OPPORTUNITY_IDS = [
  "6a7b4496a4b4f12a3141a9ab",
  "6acfc54a182ba076dc7b8e58",
];

async function main() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MongoDB URI is missing from backend/.env.");
  }

  await mongoose.connect(mongoUri);

  console.log("Connected database:", mongoose.connection.name);

  if (mongoose.connection.name !== EXPECTED_DATABASE) {
    throw new Error(`Safety stop: expected database "${EXPECTED_DATABASE}".`);
  }

  const opportunities = await Opportunity.find({
    _id: {
      $in: OPPORTUNITY_IDS.map((id) => new mongoose.Types.ObjectId(id)),
    },
  }).lean();

  if (opportunities.length !== OPPORTUNITY_IDS.length) {
    console.log(
      `WARNING: Expected ${OPPORTUNITY_IDS.length} records, found ${opportunities.length}.`,
    );
  }

  const fieldsToInspect = [
    "_id",
    "legacyId",
    "title",
    "slug",
    "countryId",
    "countryName",
    "countrySlug",
    "countryFlag",
    "countryImage",
    "countryDescription",
    "countryVisa",
    "countryDuration",
    "countryProcessingTime",
    "countryCategories",
    "location",
    "type",
    "category",
    "description",
    "image",
    "salary",
    "demand",
    "highlights",
    "requirements",
    "documents",
    "benefits",
    "steps",
    "positions",
    "workConditions",
    "contract",
    "faq",
    "pricing",
    "paymentPlan",
    "terms",
    "applicationConfig",
    "active",
    "featured",
    "createdAt",
    "updatedAt",
  ];

  for (const opportunity of opportunities) {
    const output = {};

    for (const field of fieldsToInspect) {
      if (opportunity[field] !== undefined) {
        output[field] = opportunity[field];
      }
    }

    console.log("\n========================================");
    console.log("OPPORTUNITY RECORD");
    console.log("========================================");

    console.log(JSON.stringify(output, null, 2));
  }
}

main()
  .catch((error) => {
    console.error("Comparison failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
