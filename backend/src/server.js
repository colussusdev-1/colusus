import "dotenv/config";

import { createServer } from "http";

import app from "./app.js";
import config from "./config/environment.js";
import connectDatabase from "./database/connection.js";
import logger from "./config/logger.js";

import testCloudinary from "./utils/testCloudinary.js";
import { startBlogScheduler } from "./modules/blog/index.js";
import { initializeChatSocket } from "./modules/chat/chat.socket.js";

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
HTTP SERVER
========================================================
*/

    const server = createServer(app);

    /*
========================================================
CHAT SOCKET.IO
========================================================
*/

    initializeChatSocket(server);

    /*
========================================================
START API
========================================================
*/

    server.listen(config.port, "0.0.0.0", () => {
      logger.info(
        `colossus API STARTED | Environment: ${config.nodeEnv} | Port: ${config.port} | Host: 0.0.0.0`,
      );

      logger.info("Chat Socket.IO initialized successfully.");
    });

    /*
========================================================
GRACEFUL SHUTDOWN
========================================================
*/

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down server...`);

      server.close((error) => {
        if (error) {
          logger.error(`Server shutdown failed: ${error.message}`);
          process.exit(1);
        }

        logger.info("HTTP server closed successfully.");
        process.exit(0);
      });
    };

    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Server Startup Failed");
    logger.error(error.stack || error.message);

    process.exit(1);
  }
};

startServer();
