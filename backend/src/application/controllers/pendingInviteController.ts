import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import * as PendingInviteServices from '../services/pendingInviteServices';

/**
 * Controller responsible for pending invite-related API endpoints including CRUD operations
 * and invite listings by user. Follows RESTful patterns with paths:
 * Supported endpoints:
 * - GET /users/:idParent/invites/:id - Get specific invite for a user
 * - GET /users/:idParent/invites - Get all pending invites for a user
 * - DELETE /invites/:id - Delete invite
 * - POST /invites - Create new invite
 */
export class PendingInviteController extends Controller {
  constructor(
    get: PendingInviteServices.Get,
    userGet: PendingInviteServices.UserGet,
    remove: PendingInviteServices.Delete,
    create: PendingInviteServices.Create
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: 'users', hasId: true, hasParentId: true, handler: (req: Request) => this.getOne(req) },
        { parent: 'users', hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) },
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) },
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) },
      ],
    };

    super({ get, userGet, remove, create }, handlers);
  }
}
