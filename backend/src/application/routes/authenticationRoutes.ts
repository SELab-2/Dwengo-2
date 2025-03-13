import { Express } from "express";
import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
import { AuthenticationController } from "../controllers/authenticationController";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for authentication-related endpoints.
 * Maps HTTP requests to the AuthenticationController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - POST /login - Log in user
 * - POST /register - Register new user
 * - GET /challenge - Get challenge for user
 */
export function authenticationRoutes(app: Express, controller: AuthenticationController) {
    configureRoutes(
        [
            { app, method: HttpMethod.POST, urlPattern: "/login", controller },
            { app, method: HttpMethod.POST, urlPattern: "/register", controller },
            { app, method: HttpMethod.GET, urlPattern: "/challenge", controller },
        ],
        DEFAULT_METHOD_MAP,
    );
}
