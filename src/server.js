import "dotenv/config";

import app from "./app.js";
import config from "./config/environment.js";
import connectDatabase from "./database/connection.js";
import logger from "./config/logger.js";


const startServer = async () => {
    try {

        await connectDatabase();

        app.listen(config.port, () => {

            logger.info(
                `COLUSUS API STARTED | Environment: ${config.nodeEnv} | Port: ${config.port}`
            );

        });

    } catch (error) {

        logger.error("Server Startup Failed");
        logger.error(error.message);

        process.exit(1);
    }
};


startServer();