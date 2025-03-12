import { Controller } from './controllerExpress';
import { RouteHandlers, HttpMethod, Request } from '../types';
import * as GroupServices from '../../core/services/group';
import { defaultExtractor } from './helpersExpress';


/**
 * Controller responsible for group-related API endpoints including CRUD operations
 * and group listings by user or class. Follows RESTful patterns with paths:
 * - GET /groups/:id - Get single group
 * - GET /users/:idParent/groups - Get groups for a user
 * - GET /assignments/:idParent/groups - Get groups for an assignment
 * - PATCH /groups/:id - Update a group
 * - DELETE /groups/:id - Delete a group
 * - POST /groups - Create a new group
 */
export class GroupController extends Controller {
  constructor(
    get: GroupServices.GetGroup,
    getUserGroups: GroupServices.GetUserGroups,
    getAssignmentGroups: GroupServices.GetAssignmentGroups,
    update: GroupServices.UpdateGroup,
    remove: GroupServices.DeleteGroup,
    create: GroupServices.CreateGroup
  ) {
    const handlers: RouteHandlers = {
      // [HttpMethod.GET]: [
      //   { hasId: true, hasParentId: false, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.getOne(req, data) },
      //   { parent: 'users', hasId: false, extractor: defaultExtractor,
      //     hasParentId: true, handler: (req: Request, data: object) => this.getChildren(req, data, getUserGroups) },
      //   { parent: 'assignments', hasId: false, extractor: defaultExtractor,
      //     hasParentId: true, handler: (req: Request, data: object) => this.getChildren(req, data, getAssignmentGroups) }
      // ],
      // [HttpMethod.PATCH]: [
      //   { hasId: true, hasParentId: false, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.update(req, data) }
      // ],
      // [HttpMethod.POST]: [
      //   { hasId: false, hasParentId: false, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.create(req, data) }
      // ],
      // [HttpMethod.DELETE]: [
      //   { hasId: true, hasParentId: false, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.delete(req, data) }
      // ]
    };

    super({ get, getUserGroups, getAssignmentGroups, update, remove, create }, handlers);
  }
}
