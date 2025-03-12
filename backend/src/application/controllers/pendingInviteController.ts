import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import { defaultExtractor } from './helpersExpress';
import * as PendingInviteServices from '../../core/services/join_request';

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
    get: PendingInviteServices.GetJoinRequest,
    getUserInvites: PendingInviteServices.GetUserJoinRequest,
    remove: PendingInviteServices.DeleteJoinRequest,
    create: PendingInviteServices.CreateJoinRequest
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: 'users', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getOne(req, data) },
        { parent: 'users', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req, data, getUserInvites) },
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.delete(req, data) },
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.create(req, data) },
      ],
    };

    super({ get, getUserInvites, remove, create }, handlers);
  }
}
