import { Express } from "express";
import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
import { JoinRequestController } from "../controllers/joinRequestController";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for JoinRequest related endpoints.
 * Maps HTTP requests to the JoinRequestController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /users/:idParent/invites/:id - Get specific invite for a user
 * - GET /users/:idParent/invites - Get all pending invites for a user
 * - DELETE /invites/:id - Delete invite
 * - POST /invites - Create new invite
 */
export function joinRequestRoutes(app: Express, controller: JoinRequestController): void {
    configureRoutes(
        [
            { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/invites/:id", controller },
            { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/invites", controller },
            { app, method: HttpMethod.DELETE, urlPattern: "/invites/:id", controller },
            { app, method: HttpMethod.POST, urlPattern: "/invites", controller },
        ],
        DEFAULT_METHOD_MAP,
    );
}
