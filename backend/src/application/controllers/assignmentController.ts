import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import { defaultExtractor } from './helpersExpress';
import * as AssignmentServices from '../../core/services/assignment';


/**
 * Controller responsible for assignment-related API endpoints including CRUD operations
 * and assignment listings by group. Follows RESTful patterns with paths:
 * - GET /assignments/:id - Get single assignment
 * //TODO: Groups are defined within Assignments, so this path needs to be updated or removed
 * - GET /groups/:idParent/assignments - Get assignments for a group
 * - PATCH /assignments/:id - Update an assignment
 * - POST /assignments - Create a new assignment
 * - DELETE /assignments/:id - Delete an assignment
 */
export class AssignmentController extends Controller {
  constructor(
    get: AssignmentServices.GetAssignment,
    getGroupAssignments: AssignmentServices.GetGroupAssignment,
    update: AssignmentServices.UpdateAssignment,
    remove: AssignmentServices.DeleteAssignment,
    create: AssignmentServices.CreateAssignment
  ) {
    const handlers : RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getOne(req, data) },
        { parent: 'groups', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req, data, getGroupAssignments) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.update(req, data) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.create(req, data) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.delete(req, data) }
      ]
    };

    super({ get, getGroupAssignments, update, remove, create }, handlers);
  }
}
