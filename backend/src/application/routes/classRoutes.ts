import { Express } from "express";
import { ClassController } from "../controllers/classController";
import { requestFromExpress, responseToExpress } from "../helpersExpress";

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
  app.get("/users/:idParent/classes/:id", (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get("/users/:idParent/classes", (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.patch("/classes/:id", (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.delete("/classes/:id", (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.post("/classes", (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });
}
