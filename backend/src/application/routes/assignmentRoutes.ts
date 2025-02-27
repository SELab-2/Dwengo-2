// src/application/routes/assignment_routes.ts
import { Express } from 'express';
import { requestFromExpress, responseToExpress } from '../helpers';
import { AssignmentController } from '../controllers/assignmentController';

/**
 * RESTful routing configuration for assignment-related endpoints.
 * Maps HTTP requests to the AssignmentController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /groups/:idParent/assignments/:id - Get specific assignment in a group
 * - GET /groups/:idParent/assignments - Get all assignments in a group
 * - PATCH /assignments/:id - Update assignment
 * - DELETE /assignments/:id - Delete assignment
 * - POST /assignments - Create new assignment
 */
export function assignmentRoutes(app: Express, controller: AssignmentController): void {
  // Get specific assignment in a group
  app.get('/groups/:idParent/assignments/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  // Get all assignments in a group
  app.get('/groups/:idParent/assignments', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  // Update assignment
  app.patch('/assignments/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  // Delete assignment
  app.delete('/assignments/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  // Create new assignment
  app.post('/assignments', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });
}