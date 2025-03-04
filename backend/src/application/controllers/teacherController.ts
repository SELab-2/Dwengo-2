import { Controller } from './controller';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import { extractPathParams } from '../helpersExpress';
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
      // pattern matching for each HTTP method
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
   * Retrieves a single teacher by ID
   * @param req - Request with teacher ID in path params
   * @returns Response with status 200 and teacher data
   */
  private getOne(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.respond(200, this.services.get.execute(id));
  }

  /**
   * Updates a teacher by ID
   * @param req - Request with teacher ID in path params and update data in body
   * @returns Response with status 200 and updated teacher data
   */
  private update(req: Request): Response {
    const { id } = extractPathParams(req);
    const data = req.body;
    if (!data) throw { code: 'BAD_REQUEST', message: 'Missing request body' };
    return this.respond(200, this.services.update.execute(id, data));
  }

  /**
   * Deletes a teacher by ID
   * @param req - Request with teacher ID in path params
   * @returns Response with status 204 (No Content)
   */
  private delete(req: Request): Response {
    const { id } = extractPathParams(req);
    return this.respond(204, this.services.remove.execute(id));
  }

  /**
   * Removes a teacher from a class
   * @param req - Request with class ID and teacher ID in path params
   * @returns Response with status 204 (No Content)
   */
  private removeFromClass(req: Request): Response {
    const { id, idParent } = extractPathParams(req);
    return this.respond(204, this.services.classRemove.execute(id, idParent));
  }
}
