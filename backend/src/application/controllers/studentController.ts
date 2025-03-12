import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import * as StudentServices from '../../core/services/student';
import { createParamsExtractor } from '../extractors';

const extractors = {
  getStudent: createParamsExtractor(StudentServices.GetStudent)
};

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
    get: StudentServices.GetStudent,
    // update: StudentServices.UpdateStudent,
    // remove: StudentServices.DeleteStudent,
    // removeClassStudent: StudentServices.RemoveStudentFromClass,
    // removeGroupStudent: StudentServices.RemoveStudentFromGroup
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, extractor: extractors.getStudent,
          handler: (req: Request, data: object) => this.getOne(req, data) }
      ],
      // [HttpMethod.PATCH]: [
      //   { hasId: true, hasParentId: false, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.update(req, data) }
      // ],
      // [HttpMethod.DELETE]: [
      //   { hasId: true, hasParentId: false, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.delete(req, data) },
      //   { parent: 'classes', hasId: true, hasParentId: true, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.removeChild(req, data, removeClassStudent) },
      //   { parent: 'groups', hasId: true, hasParentId: true, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.removeChild(req, data, removeGroupStudent) }
      // ]
    };

    super({ get/*, update, remove, removeClassStudent, removeGroupStudent*/ }, handlers);
  }
}
