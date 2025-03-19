import cors from "cors";
import express from "express";
import { Express } from "express";

/**
 * Setup all middleware for the application.
 *
 * Sets up the cors and express.json middleware,
 *
 * @param app The epxress app
 */
export function setupMiddleware(app: Express): void {
    app.use(cors());
    app.use(express.json());
}
