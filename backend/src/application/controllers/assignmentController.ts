import { Controller } from './controllerExpress';
import { RouteHandlers } from '../types';
import * as AssignmentServices from '../../core/services/assignment';


/**
 * Controller responsible for assignment-related API endpoints including CRUD operations
 * and assignment listings by group. Follows RESTful patterns with paths:
 * - GET /assignments/:id - Get single assignment
 * - GET /users/:idParent/assignments - Get assignments for a user
 * - PATCH /assignments/:id - Update an assignment
 * - POST /assignments - Create a new assignment
 * - DELETE /assignments/:id - Delete an assignment
 */
export class AssignmentController extends Controller {
  constructor(
    get: AssignmentServices.GetAssignment,
    getUserAssignments: AssignmentServices.GetUserAssignments,
    update: AssignmentServices.UpdateAssignment,
    remove: AssignmentServices.DeleteAssignment,
    create: AssignmentServices.CreateAssignment
  ) {
    const handlers : RouteHandlers = {
      // [HttpMethod.GET]: [
      //   { hasId: true, hasParentId: false, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.getOne(req, data) },
      //   { parent: 'users', hasId: false, hasParentId: true, extractor: defaultExtractor,
      //     handler: (req: Request, data: object) => this.getChildren(req, data, getUserAssignments) }
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

    super({ get, getUserAssignments, update, remove, create }, handlers);
  }
}
