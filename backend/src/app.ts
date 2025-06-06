import dotenv from "dotenv";
import express from "express";
import log4js from "log4js";
import { logger, setupLogger } from "./config/logger";
import { setupDefaultMiddleware, setupErrorMiddleware } from "./config/setupMiddleware";
import { setupRoutes } from "./config/setupRoutes";
import { setupServer } from "./config/setupServer";

dotenv.config();
setupLogger();
const app = express();
setupDefaultMiddleware(app);
setupRoutes(app);
setupErrorMiddleware(app);

const server = setupServer(app);

// Handle graceful shutdown
process.on("SIGINT", () => {
    logger.info("Shutting down application...");
    server.close(() => {
        logger.info("HTTP server closed");
        log4js.shutdown(() => {
            logger.info("Logger shut down");
            process.exit(0);
        });
    });
});

export { app, server };
