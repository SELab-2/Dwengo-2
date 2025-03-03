import { Express } from "express";
import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
import { ClassController } from "../controllers/classController";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for class-related endpoints.
 * Maps HTTP requests to the ClassController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /users/:idParent/classes/:id - Get user's class by ID
 * - GET /users/:idParent/classes - Get classes for a user
 * - PATCH /classes/:id - Update class data
 * - DELETE /classes/:id - Delete class
 * - POST /classes - Create a new class
 */
export function classRoutes(app: Express, controller: ClassController): void {
  configureRoutes([
    { app, method: HttpMethod.GET,    urlPattern: "/users/:idParent/classes/:id", controller },
    { app, method: HttpMethod.GET,    urlPattern: "/users/:idParent/classes", controller },
    { app, method: HttpMethod.PATCH,  urlPattern: "/classes/:id", controller },
    { app, method: HttpMethod.DELETE, urlPattern: "/classes/:id", controller },
    { app, method: HttpMethod.POST,   urlPattern: "/classes", controller },
  ], DEFAULT_METHOD_MAP);
}
