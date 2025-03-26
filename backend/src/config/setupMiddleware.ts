import cors from "cors";
import express from "express";
import { Express, Request, Response, NextFunction } from "express";
import log4js from "log4js";
import { httpLogger, errorLogger } from "./logger";
import { defaultErrorHandler, responseToExpress } from "../application/helpersExpress";
import { ErrorCode } from "../application/types";

/**
 * Setup all middleware for the application.
 *
 * Sets up the cors and express.json middleware,
 *
 * @param app The epxress app
 */
export function setupDefaultMiddleware(app: Express): void {
    app.use(
        log4js.connectLogger(httpLogger, {
            level: "info",
            format: (req, res, format) =>
                format(
                    `:remote-addr - ":method :url" - Status: :status - ` +
                        `Size: :content-length - Response Time: :response-time ms`,
                ),
        }),
    );
    app.use(cors());
    app.use(express.json());
}

/**
 * Setup error handling middleware for the application.
 * This should be called after all routes are registered.
 * @param app The epxress app
 */
export function setupErrorMiddleware(app: Express): void {
    app.use((req: Request, res: Response) => {
        httpLogger.warn(`404 - Not Found: ${req.method} ${req.originalUrl}`);
        const response = defaultErrorHandler({
            code: ErrorCode.NOT_FOUND,
            message: `Cannot ${req.method} ${req.path}`,
        });
        responseToExpress(response, res);
    });

    // Global error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorLogger.error(`Unhandled error: ${err.message}`, {
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
        });
        if (res.headersSent) {
            next(err);
            return;
        }

        const response = defaultErrorHandler(undefined);
        responseToExpress(response, res);
    });
}
