import { Controller } from './controllerExpress';
import { Request, Response, HttpMethod, RouteHandlers } from '../types';
import { defaultExtractor } from './helpersExpress';
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
    removeClassStudent: StudentServices.RemoveStudentFromClassService,
    removeGroupStudent: StudentServices.RemoveStudentFromGroupService
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
          handler: (req: Request, data: object) => this.removeChild(req, data, removeClassStudent) },
        { parent: 'groups', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.removeChild(req, data, removeGroupStudent) }
      ]
    };

    super({ get, update, remove, removeClassStudent, removeGroupStudent }, handlers);
  }
}
