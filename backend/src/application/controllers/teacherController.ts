import { Controller } from './controllerExpress';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import * as TeacherServices from '../services/teacherServices';

/**
 * Controller responsible for teacher-related API endpoints including user management
 * operations that are specific to teachers. Follows RESTful patterns with paths:
 * - GET /users/:id(t-.*) - Get teacher details
 * - PATCH /users/:id(t-.*) - Update teacher information
 * - DELETE /users/:id(t-.*) - Delete teacher account
 * - DELETE /classes/:idParent/users/:id(t-.*) - Remove teacher from class
 */
export class TeacherController extends Controller {
  constructor(
    get: TeacherServices.GetTeacherService,
    update: TeacherServices.UpdateTeacherService,
    remove: TeacherServices.DeleteTeacherService,
    classRemove: TeacherServices.RemoveTeacherFromClassService
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.getOne(req) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.update(req) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) },
        { parent: 'classes', hasId: true, hasParentId: true, handler: (req: Request) => this.removeFromClass(req) }
      ]
    };

    super({ get, update, remove, classRemove }, handlers);
  }

  /**
   * Removes a teacher from a class
   * @param req - Request with class ID and teacher ID in path params
   * @returns Response with status 204 (No Content)
   */
  protected removeFromClass(req: Request): Response {
    // TODO: implement this method
    return this.respond(501, { code: 'NOT_IMPLEMENTED', message: 'Method not implemented' });
  }
}
