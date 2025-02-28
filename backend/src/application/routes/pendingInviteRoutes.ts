import { Express } from 'express';
import { requestFromExpress, responseToExpress } from '../helpersExpress';
import { PendingInviteController } from '../controllers/pendingInviteController';

/**
 * RESTful routing configuration for PendingInvite related endpoints.
 * Maps HTTP requests to the PendingInviteController's handle method after
 * converting Express request/response objects to our internal format.
 * 
 * Supported endpoints:
 * - GET /users/:idParent/invites/:id - Get specific invite for a user
 * - GET /users/:idParent/invites - Get all pending invites for a user
 * - DELETE /invites/:id - Delete invite
 * - POST /invites - Create new invite
 */
export function pendingInviteRoutes(app: Express, controller: PendingInviteController): void {
  app.get('/users/:idParent/invites/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.get('/users/:idParent/invites', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.delete('/invites/:id', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });

  app.post('/invites', (req, res) => {
    const request = requestFromExpress(req);
    const response = controller.handle(request);
    responseToExpress(response, res);
  });
}
