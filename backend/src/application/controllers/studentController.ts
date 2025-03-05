import { Controller } from './controllerExpress';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import * as StudentServices from '../services/studentServices';

/**
 * Controller responsible for student-related API endpoints including user management
 * operations that are specific to students. Follows RESTful patterns with paths:
 * - GET /users/:id(s-.*) - Get student details
 * - PATCH /users/:id(s-.*) - Update student information
 * - DELETE /users/:id(s-.*) - Delete student account
 * - DELETE /classes/:idParent/users/:id(s-.*) - Remove student from class
 * - DELETE /groups/:idParent/users/:id(s-.*) - Remove student from group
 */
export class StudentController extends Controller {
  constructor(
    get: StudentServices.GetStudentService,
    update: StudentServices.UpdateStudentService,
    remove: StudentServices.DeleteStudentService,
    classRemove: StudentServices.RemoveStudentFromClassService,
    groupRemove: StudentServices.RemoveStudentFromGroupService
  ) {
    const handlers: RouteHandlers = {
      // pattern matching for each HTTP method
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.getOne(req) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.update(req) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) },
        { parent: 'classes', hasId: true, hasParentId: true, handler: (req: Request) => this.removeFromClass(req) },
        { parent: 'groups', hasId: true, hasParentId: true, handler: (req: Request) => this.removeFromGroup(req) }
      ]
    };

    super({ get, update, remove, classRemove, groupRemove }, handlers);
  }

  /**
   * Removes a student from a class
   * @param req - Request with class ID and student ID in path params
   * @returns Response with status 204 (No Content)
   */
  protected removeFromClass(req: Request): Response {
    // TODO: implement
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' })
  }

  /**
   * Removes a student from a group
   * @param req - Request with group ID and student ID in path params
   * @returns Response with status 204 (No Content)
   */
  private removeFromGroup(req: Request): Response {
    // TODO: implement
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' })
  }
}
