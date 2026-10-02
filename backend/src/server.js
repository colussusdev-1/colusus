import "dotenv/config";

import app from "./app.js";
import config from "./config/environment.js";
import connectDatabase from "./database/connection.js";
import logger from "./config/logger.js";

import testCloudinary from "./utils/testCloudinary.js";

import { startBlogScheduler } from "./modules/blog/index.js";

const startServer = async () => {
  try {
    /*
    ========================================================
    DATABASE CONNECTION
    ========================================================
    */

    await connectDatabase();

    /*
    ========================================================
    CLOUDINARY CONNECTION TEST
    ========================================================
    */

    await testCloudinary();

    /*
    ========================================================
    BLOG SCHEDULER
    ========================================================
    */

    startBlogScheduler();

    /*
    ========================================================
    START API
    ========================================================
    */

    app.listen(config.port, "0.0.0.0", () => {
      logger.info(
        `colossus API STARTED | Environment: ${config.nodeEnv} | Port: ${config.port} | Host: 0.0.0.0`,
      );
    });
  } catch (error) {
    logger.error("Server Startup Failed");

    logger.error(error.message);

    process.exit(1);
  }
};

startServer();
