import { Controller } from "./controllerExpress";
import { ServiceParams } from "../../config/service";
import * as AssignmentServices from "../../core/services/assignment";
import { createParamsExtractor } from "../extractors";
import { RouteHandlers, HttpMethod, Request } from "../types";

const extractors = {
    getAssignment: createParamsExtractor(AssignmentServices.GetAssignmentParams, { _assignmentId: "id" }, {}, []),
    getUserAssignments: createParamsExtractor(AssignmentServices.GetUserAssignmentsParams, { _id: "idParent" }, {}),
    updateAssignment: createParamsExtractor(AssignmentServices.UpdateAssignmentParams, { _id: "id" }, {}, [
        "_classId",
        "_learningPathId",
        "_startDate",
        "_deadline",
        "_extraInstructions",
    ]),
    deleteAssignment: createParamsExtractor(AssignmentServices.DeleteAssignmentParams, { _id: "id" }, {}),
    createAssignment: createParamsExtractor(
        AssignmentServices.CreateAssignmentParams,
        {
            _classId: "class",
            _learningPathId: "learningPath",
            _startDate: "startDate",
            _deadline: "deadline",
            _extraInstructions: "extraInstructions",
            _teacherId: "teacher",
        },
        {},
        [],
    ),
};

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
        create: AssignmentServices.CreateAssignment,
    ) {
        const handlers: RouteHandlers = {
            [HttpMethod.GET]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.getAssignment,
                    handler: (req: Request, data: ServiceParams) => this.getOne(req, data),
                },
                {
                    parent: "users",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.getUserAssignments,
                    handler: (req: Request, data: AssignmentServices.GetUserAssignmentsParams) =>
                        this.getChildren(req, data, getUserAssignments),
                },
            ],
            [HttpMethod.PATCH]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.updateAssignment,
                    handler: (req: Request, data: ServiceParams) => this.update(req, data),
                },
            ],
            [HttpMethod.POST]: [
                {
                    hasId: false,
                    hasParentId: false,
                    extractor: extractors.createAssignment,
                    handler: (req: Request, data: ServiceParams) => this.create(req, data),
                },
            ],
            [HttpMethod.DELETE]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.deleteAssignment,
                    handler: (req: Request, data: ServiceParams) => this.delete(req, data),
                },
            ],
        };

        super({ get, getUserAssignments, update, remove, create }, handlers);
    }
}
