import { Express } from 'express';
import { requestFromExpress, responseToExpress } from '../helpersExpress';
import { GroupController } from '../controllers/groupController';

/**
 * RESTful routing configuration for group-related endpoints.
 * Maps HTTP requests to the GroupController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /users/:idParent/groups/:id - Get specific group from a user
 * - GET /users/:idParent/groups - Get all groups of a user
 * - GET /classes/:idParent/groups/:id - Get specific group from a class
 * - GET /classes/:idParent/groups - Get all groups of a class
 * - PATCH /groups/:id - Update group
 * - DELETE /groups/:id - Delete group
 * - POST /groups - Create new group
 */
export function groupRoutes(app: Express, controller: GroupController): void {
  app.get('/users/:idParent/groups/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/users/:idParent/groups', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/classes/:idParent/groups/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/classes/:idParent/groups', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.patch('/groups/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.delete('/groups/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.post('/groups', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });
}
