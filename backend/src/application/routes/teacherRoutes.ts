import { Express } from 'express';
import { requestFromExpress, responseToExpress } from '../helpersExpress';
import { TeacherController } from '../controllers/teacherController';

/**
 * RESTful routing configuration for teacher-related endpoints.
 * Maps HTTP requests to the TeacherController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /classes/:idParent/users - Get all users in a class
 * - DELETE /classes/:idParent/users/:id - Remove user from class
 * - GET /groups/:idParent/users - Get all users in a group
 * - DELETE /groups/:idParent/users/:id - Remove user from group
 * - POST /groups/:idParent/users - Assign user to group
 * - GET /assignments/:idParent/users - Get all users in an assignment
 * - POST /assignments/:idParent/users - Assign teacher to an assignment
 * - GET /users/:id - Get specific user
 * - GET /users - Get all users
 * - PATCH /users/:id - Update user
 * - DELETE /users/:id - Delete user
 * - POST /users - Create new user
 */
export function teacherRoutes(app: Express, controller: TeacherController): void {
  app.get('/classes/:idParent/users', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.delete('/classes/:idParent/users/:id(t-.*)', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/groups/:idParent/users', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.delete('/groups/:idParent/users/:id(t-.*)', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.post('/groups/:idParent/users', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/assignments/:idParent/users', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.post('/assignments/:idParent/users', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/users/:id(t-.*)', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/users', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.patch('/users/:id(t-.*)', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.delete('/users/:id(t-.*)', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.post('/users', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });
}