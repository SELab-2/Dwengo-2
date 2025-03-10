import { Express } from "express";
import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
import { QuestionController } from "../controllers/questionController";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for question-thread-related endpoints.
 * Maps HTTP requests to the QuestionThreadController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /assignments/:idParent/questions/:id - Get specific question in an assignment
 * - GET /assignments/:idParent/questions - Get all questions in an assignment
 * - PATCH /assigmnets/:idParent/questions/:id - Update question
 * - DELETE /assignments/:idParent/questions/:id - Delete question
 * - POST /assignments/:idParent/questions - Create new question
 */
export function questionThreadRoutes(app: Express, controller: QuestionController): void {
  configureRoutes([
    { app, method: HttpMethod.GET,    urlPattern: "/assignments/:idParent/questions/:id", controller },
    { app, method: HttpMethod.GET,    urlPattern: "/assignments/:idParent/questions", controller },
    { app, method: HttpMethod.PATCH,  urlPattern: "/assignments/:idParent/questions/:id", controller },
    { app, method: HttpMethod.DELETE, urlPattern: "/assignments/:idParent/questions/:id", controller },
    { app, method: HttpMethod.POST,   urlPattern: "/assignments/:idParent/questions", controller },
  ], DEFAULT_METHOD_MAP);
}
