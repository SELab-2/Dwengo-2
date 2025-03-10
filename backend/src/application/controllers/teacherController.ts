import { Controller } from './controllerExpress';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import * as TeacherServices from '../../core/services/teacher/index';
import { defaultExtractor } from './helpersExpress';


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
    get: TeacherServices.GetTeacher,
    update: TeacherServices.UpdateTeacher,
    remove: TeacherServices.DeleteTeacher,
    removeClassTeacher: TeacherServices.RemoveTeacherFromClass
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getOne(req, data) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.update(req, data) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.delete(req, data) },
        { parent: 'classes', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.removeChild(req, data, removeClassTeacher) }
      ]
    };

    super({ get, update, remove, removeClassTeacher }, handlers);
  }
}
