import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import * as AssignmentServices from '../services/assignmentServices';

/**
 * Controller responsible for assignment-related API endpoints including CRUD operations
 * and assignment listings by group. Follows RESTful patterns with paths:
 * - GET /assignments/:id - Get single assignment
 * - GET /groups/:idParent/assignments - Get assignments for a group
 * - PATCH /assignments/:id - Update an assignment
 * - POST /assignments - Create a new assignment
 * - DELETE /assignments/:id - Delete an assignment
 */
export class AssignmentController extends Controller {
  constructor(
    get: AssignmentServices.GetAssignmentService,
    groupGet: AssignmentServices.GetGroupAssignmentsService,
    update: AssignmentServices.UpdateAssignmentService,
    remove: AssignmentServices.DeleteAssignmentService,
    create: AssignmentServices.CreateAssignmentService
  ) {
    const handlers : RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.getOne(req) },
        { parent: 'groups', hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.update(req) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) }
      ]
    };

    super({ get, groupGet, update, remove, create }, handlers);
  }
}
