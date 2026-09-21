import "dotenv/config";

import mongoose from "mongoose";

import Application from "../src/modules/applications/application.model.js";

import config from "../src/config/environment.js";

const PROGRESS_MAP = {
  DRAFT: 0,

  IN_PROGRESS: 15,

  SUBMITTED: 30,

  UNDER_REVIEW: 45,

  DOCUMENT_REQUEST: 50,

  PROCESSING: 70,

  APPROVED: 100,

  REJECTED: 0,
};

const run = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    console.log("MongoDB connected.");

    const applications = await Application.find({}).select("_id status");

    console.log(`Found ${applications.length} applications.`);

    let updated = 0;

    for (const application of applications) {
      const progress = PROGRESS_MAP[application.status] ?? 0;

      await Application.updateOne(
        {
          _id: application._id,
        },

        {
          $set: {
            progress,
          },
        },
      );

      updated++;
    }

    console.log(`Updated ${updated} applications.`);
  } catch (error) {
    console.error("BACKFILL FAILED:", error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
