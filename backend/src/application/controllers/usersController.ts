import { Controller } from './controllerExpress';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import * as UsersServices from '../services/usersServices';
import { defaultExtractor } from './helpersExpress';

/**
 * Controller responsible for general user-related API endpoints including
 * user listings, creation, and assignment to groups and assignments.
 * Follows RESTful patterns with paths:
 * - GET /users - Get all users
 * - POST /users - Create new user
 * - GET /classes/:idParent/users - Get all users in a class
 * - GET /groups/:idParent/users - Get all users in a group
 * - POST /groups/:idParent/users - Assign user to group
 * - GET /assignments/:idParent/users - Get all users in an assignment
 * - POST /assignments/:idParent/users - Assign user to an assignment
 */
export class UsersController extends Controller {
  constructor(
    getAll: UsersServices.GetAllUsersService,
    create: UsersServices.CreateUserService,
    getClassUsers: UsersServices.GetClassUsersService,
    getGroupUsers: UsersServices.GetGroupUsersService,
    addGroupUser: UsersServices.AssignUserToGroupService,
    getAssignmentUsers: UsersServices.GetAssignmentUsersService,
    addAssignmentUser: UsersServices.AssignUserToAssignmentService
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: false, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getAll(req, data) },
        { parent: 'classes', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req, data, getClassUsers) },
        { parent: 'groups', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req, data, getGroupUsers) },
        { parent: 'assignments', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req, data, getAssignmentUsers) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.create(req, data) },
        { parent: 'groups', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.addChild(req, data, addGroupUser) },
        { parent: 'assignments', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.addChild(req, data, addAssignmentUser) }
      ]
    };

    super({ getAll, create, getClassUsers, getGroupUsers, addGroupUser, getAssignmentUsers, addAssignmentUser }, handlers);
  }
}
