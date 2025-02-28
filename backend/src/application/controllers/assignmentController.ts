import { Controller } from './controller';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import { extractPathParams, extractQueryParams } from '../helpersExpress';
import { Get, GroupGet, Update, Delete, Create } from '../services/assignmentServices';

/**
 * Controller responsible for assignment-related API endpoints including CRUD operations
 * and assignment listings by group. Follows RESTful patterns with paths:
 * - GET /assignments/:id - Get single assignment
 * - GET /groups/:idParent/assignments - Get assignments for a group
 * - PATCH /assignments/:id - Update an assignment
 * - POST /assignments - Create a new assignment
 * - DELETE /assignments/:id - Delete an assignment
 */
export class AssignmentController extends Controller {
  constructor(
    get: Get,
    groupGet: GroupGet,
    update: Update,
    remove: Delete,
    create: Create
  ) {
    const handlers : RouteHandlers = {
      // pattern matching for each HTTP method
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.getOne(req) },
        { parent: 'groups', hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) }
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

    super({ get, groupGet, update, remove, create }, handlers);
  }


  /**
   * Retrieves a single assignment by ID
   * @param req - Request with assignment ID in path params
   * @returns Response with status 200 and assignment data
   */
  private getOne(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.respond(200, this.services.get.execute(id));
  }

  /**
   * Retrieves multiple assignments belonging to a specific group with pagination
   * @param req - Request with group ID in path params and page/size in query params
   * @returns Response with status 200 and paginated assignment collection
   */
  private getMany(req: Request): Response {
    const { idParent } = extractPathParams(req);
    const { page, size } = extractQueryParams(req);
    if (page === undefined || size === undefined)
      throw { code: 'BAD_REQUEST', message: 'Missing required query parameters: page and size' };
    return this.respond(200, this.services.groupGet.execute(idParent, page, size));
  }

  /**
   * Updates an assignment by ID
   * @param req - Request with assignment ID in path params and update data in body
   * @returns Response with status 200 and updated assignment data
   */
  private update(req: Request): Response {
    const { id } = extractPathParams(req);
    const data = req.body;
    if (!data) throw { code: 'BAD_REQUEST', message: 'Missing request body' };
    return this.response(200, this.services.update.execute(id, data));
  }

  /**
   * Deletes an assignment by ID
   * @param req - Request with assignment ID in path params
   * @returns Response with status 204 (No Content)
   */
  private delete(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.response(204, this.services.remove.execute(id));
  }

  /**
   * Creates a new assignment
   * @param req - Request with assignment data in body
   * @returns Response with status 201 and created assignment data
   */
  private create(req: Request): Response {
    const data = req.body;
    if (!data) throw { code: 'BAD_REQUEST', message: 'Missing request body' };
    return this.response(201, this.services.create.execute(data));
  }
}
