import { Controller } from './controllerExpress';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import * as UsersServices from '../services/usersServices';

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
    assignToGroup: UsersServices.AssignUserToGroupService,
    getAssignmentUsers: UsersServices.GetAssignmentUsersService,
    assignToAssignment: UsersServices.AssignUserToAssignmentService
  ) {
    const handlers: RouteHandlers = {
      // pattern matching for each HTTP method
      [HttpMethod.GET]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.getAll(req) },
        { parent: 'classes', hasId: false, hasParentId: true, handler: (req: Request) => this.getClassUsers(req) },
        { parent: 'groups', hasId: false, hasParentId: true, handler: (req: Request) => this.getGroupUsers(req) },
        { parent: 'assignments', hasId: false, hasParentId: true, handler: (req: Request) => this.getAssignmentUsers(req) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) },
        { parent: 'groups', hasId: false, hasParentId: true, handler: (req: Request) => this.assignToGroup(req) },
        { parent: 'assignments', hasId: false, hasParentId: true, handler: (req: Request) => this.assignToAssignment(req) }
      ]
    };

    super({ getAll, create, getClassUsers, getGroupUsers, assignToGroup, getAssignmentUsers, assignToAssignment }, handlers);
  }

  /**
   * Retrieves all users in a class with pagination
   * @param req - Request with class ID and pagination parameters
   * @returns Response with status 200 and list of users
   */
  private getClassUsers(req: Request): Response {
    // TODO: implement this method
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' });
  }

  /**
   * Retrieves all users in a group with pagination
   * @param req - Request with group ID and pagination parameters
   * @returns Response with status 200 and list of users
   */
  private getGroupUsers(req: Request): Response {
    // TODO: implement this method
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' });  
  }

  /**
   * Assigns a user to a group
   * @param req - Request with group ID and user data in body
   * @returns Response with status 201 and assigned user data
   */
  private assignToGroup(req: Request): Response {
    // TODO: implement this method
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' });
  }

  /**
   * Retrieves all users in an assignment with pagination
   * @param req - Request with assignment ID and pagination parameters
   * @returns Response with status 200 and list of users
   */
  private getAssignmentUsers(req: Request): Response {
    // TODO: implement this method
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' });
  }

  /**
   * Assigns a user to an assignment
   * @param req - Request with assignment ID and user data in body
   * @returns Response with status 201 and assigned user data
   */
  private assignToAssignment(req: Request): Response {
    // TODO: implement this method
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' });
  }
}
