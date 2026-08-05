import mongoose from "mongoose";

import config from "../config/environment.js";
import logger from "../config/logger.js";

import seedDatabase from "../seeders/index.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    logger.info("MongoDB Connected Successfully");

    await seedDatabase();

    logger.info("Database Seed Completed");
  } catch (error) {
    logger.error("MongoDB Connection Failed");

    logger.error(error.message);

    process.exit(1);
  }
};

export default connectDatabase;
