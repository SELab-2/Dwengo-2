import { Express } from "express";
import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
import { MessageController } from "../controllers/messageController";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for message-related endpoints.
 * Maps HTTP requests to the MessageController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /questions/:idParent/messages/:id - Get specific message in a question thread
 * - GET /questions/:idParent/messages - Get all messages in a question thread
 * - PATCH /questions/:idParent/messages/:id - Update message
 * - DELETE /questions/:idParent/messages/:id - Delete message
 * - POST /questions/:idParent/messages - Create new message
 */
export function messageRoutes(app: Express, controller: MessageController): void {
    configureRoutes(
        [
            { app, method: HttpMethod.GET, urlPattern: "/questions/:idParent/messages/:id", controller },
            { app, method: HttpMethod.GET, urlPattern: "/questions/:idParent/messages", controller },
            { app, method: HttpMethod.PATCH, urlPattern: "/questions/:idParent/messages/:id", controller },
            { app, method: HttpMethod.DELETE, urlPattern: "/questions/:idParent/messages/:id", controller },
            { app, method: HttpMethod.POST, urlPattern: "/questions/:idParent/messages", controller },
        ],
        DEFAULT_METHOD_MAP,
    );
}
