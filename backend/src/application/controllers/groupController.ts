import { Controller } from './controllerExpress';
import { RouteHandlers, HttpMethod, Request, Response } from '../types';
import * as GroupServices from '../services/groupServices';

/**
 * Controller responsible for group-related API endpoints including CRUD operations
 * and group listings by user or class. Follows RESTful patterns with paths:
 * - GET /groups/:id - Get single group
 * - GET /users/:idParent/groups - Get groups for a user
 * - GET /classes/:idParent/groups - Get groups for a class
 * - PATCH /groups/:id - Update a group
 * - DELETE /groups/:id - Delete a group
 * - POST /groups - Create a new group
 */
export class GroupController extends Controller {
  constructor(
    get: GroupServices.GetGroupService,
    userGet: GroupServices.GetUserGroupsService,
    classGet: GroupServices.GetClassGroupsService,
    update: GroupServices.UpdateGroupService,
    remove: GroupServices.DeleteGroupService,
    create: GroupServices.CreateGroupService
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.getOne(req) },
        { parent: 'users', hasId: false, hasParentId: true, handler: (req: Request) => this.getUserGroups(req) },
        { parent: 'classes', hasId: false, hasParentId: true, handler: (req: Request) => this.getClassGroups(req) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.update(req) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) }
      ]
    };

    super({ get, userGet, classGet, update, remove, create }, handlers);
  }

  /**
   * Returns all groups for a user
   * @param req - Request with user ID and group ID in path params
   * @returns Response with all groups for a user
   */
  protected getUserGroups(req: Request): Response {
    // TODO: implement this function based on the use cases
    // TODO: see if we can abstract this function
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Not implemented' });
  }

  /**
   * Returns all groups for a class
   * @param req - Request with class ID and group ID in path params
   * @returns Response with all groups for a class
   */
  protected getClassGroups(req: Request): Response {
    // TODO: implement this function based on the use cases
    // TODO: see if we can abstract this function
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Not implemented' });
  }
}
