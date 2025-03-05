import { Controller } from './controllerExpress';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import { extractPathParams } from '../helpersExpress';
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
   * Retrieves a single student by ID
   * @param req - Request with student ID in path params
   * @returns Response with status 200 and student data
   */
  private getOne(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.respond(200, this.services.get.execute(id));
  }

  /**
   * Updates a student by ID
   * @param req - Request with student ID in path params and update data in body
   * @returns Response with status 200 and updated student data
   */
  private update(req: Request): Response {
    const { id } = extractPathParams(req);
    const data = req.body;
    if (!data) throw { code: 'BAD_REQUEST', message: 'Missing request body' };
    return this.respond(200, this.services.update.execute(id, data));
  }

  /**
   * Deletes a student by ID
   * @param req - Request with student ID in path params
   * @returns Response with status 204 (No Content)
   */
  private delete(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.respond(204, this.services.remove.execute(id));
  }

  /**
   * Removes a student from a class
   * @param req - Request with class ID and student ID in path params
   * @returns Response with status 204 (No Content)
   */
  private removeFromClass(req: Request): Response {
    const { id, idParent } = extractPathParams(req);
    return this.respond(204, this.services.classRemove.execute(id, idParent));
  }

  /**
   * Removes a student from a group
   * @param req - Request with group ID and student ID in path params
   * @returns Response with status 204 (No Content)
   */
  private removeFromGroup(req: Request): Response {
    const { id, idParent } = extractPathParams(req);
    return this.respond(204, this.services.groupRemove.execute(id, idParent));
  }
}
