import "dotenv/config";

import app from "./app.js";
import config from "./config/environment.js";
import connectDatabase from "./database/connection.js";
import logger from "./config/logger.js";

import testCloudinary from "./utils/testCloudinary.js";

const startServer = async () => {
  try {
    await connectDatabase();

    /*
        ========================================================
        CLOUDINARY CONNECTION TEST
        ========================================================
        */
    await testCloudinary();

    /*
        ========================================================
        START API
        ========================================================
        */
    app.listen(config.port, "0.0.0.0", () => {
      logger.info(
        `colossus API STARTED | Environment: ${config.nodeEnv} | Port: ${config.port} | Host: 0.0.0.0`
      );
    });
  } catch (error) {
    logger.error("Server Startup Failed");
    logger.error(error.message);
    process.exit(1);
  }
};

startServer();
