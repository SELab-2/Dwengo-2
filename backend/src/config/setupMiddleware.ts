import express from "express";
import { Express } from 'express';
import cors from "cors";

/**
 * Setup all middleware for the application.
 * 
 * Sets up the cors and express.json middleware,
 * as well as our own authorization middleware.
 * 
 * @param app The epxress app
 */
export function setupMiddleware(app: Express): void {
  app.use(cors());
  app.use(express.json());
}
