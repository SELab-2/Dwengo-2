import dotenv from "dotenv";
import express from "express";
import { setupDefaultMiddleware, setupErrorMiddleware } from "./config/setupMiddleware";
import { setupRoutes } from "./config/setupRoutes";
import { setupServer } from "./config/setupServer";

dotenv.config();
const app = express();
setupDefaultMiddleware(app);
setupRoutes(app);
setupErrorMiddleware(app);
setupServer(app);
