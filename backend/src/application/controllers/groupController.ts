import { Controller } from './controller';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import { extractPathParams, extractQueryParams } from '../helpersExpress';
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
      // pattern matching for each HTTP method
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
   * Retrieves a single group by ID
   * @param req - Request with group ID in path params
   * @returns Response with status 200 and group data
   */
  private getOne(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.respond(200, this.services.get.execute(id));
  }

  /**
   * Retrieves multiple groups belonging to a specific user with pagination
   * @param req - Request with user ID in path params and page/size in query params
   * @returns Response with status 200 and paginated group collection
   */
  private getUserGroups(req: Request): Response {
    const { idParent } = extractPathParams(req);
    const { page, size } = extractQueryParams(req);
    if (page === undefined || size === undefined)
      throw { code: 'BAD_REQUEST', message: 'Missing required query parameters: page and size' };
    return this.respond(200, this.services.userGet.execute(idParent, 'user', page, size));
  }

  /**
   * Retrieves multiple groups belonging to a specific class with pagination
   * @param req - Request with class ID in path params and page/size in query params
   * @returns Response with status 200 and paginated group collection
   */
  private getClassGroups(req: Request): Response {
    const { idParent } = extractPathParams(req);
    const { page, size } = extractQueryParams(req);
    if (page === undefined || size === undefined)
      throw { code: 'BAD_REQUEST', message: 'Missing required query parameters: page and size' };
    return this.respond(200, this.services.classGet.execute(idParent, 'class', page, size));
  }

  /**
   * Updates a group by ID
   * @param req - Request with group ID in path params and update data in body
   * @returns Response with status 200 and updated group data
   */
  private update(req: Request): Response {
    const { id } = extractPathParams(req);
    const data = req.body;
    if (!data) throw { code: 'BAD_REQUEST', message: 'Missing request body' };
    return this.respond(200, this.services.update.execute(id, data));
  }

  /**
   * Deletes a group by ID
   * @param req - Request with group ID in path params
   * @returns Response with status 204 (No Content)
   */
  private delete(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.respond(204, this.services.remove.execute(id));
  }

  /**
   * Creates a new group
   * @param req - Request with group data in body
   * @returns Response with status 201 and created group data
   */
  private create(req: Request): Response {
    const data = req.body;
    if (!data) throw { code: 'BAD_REQUEST', message: 'Missing request body' };
    return this.respond(201, this.services.create.execute(data));
  }
}
