import { Controller } from './controller';
import { Request, HttpMethod, RouteHandlers } from '../types';
import { Get, UserGet, Delete, Create } from '../services/pendingInviteServices';

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
  public constructor(
    get: Get,
    userGet: UserGet,
    remove: Delete,
    create: Create
  ) {
    const handlers: RouteHandlers = {
      // pattern matching for each HTTP method
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: true, handler: (req: Request) => this.getOne(req) },
        { hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) }
      ]
    };

    super({ get, userGet, remove, create }, handlers);
  }
}
