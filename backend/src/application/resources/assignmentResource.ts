import * as deps from "./dependencies";
import * as AssignmentServices from "../../core/services/assignment";
import * as AssignmentSchemas from "../schemas/assignmentSchemas";

/**
 * RESTful routing configuration for assignment-related endpoints.
 * Maps HTTP requests to the AssignmentController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /assignments/:id - Get specific assignment
 * - PATCH /assignments/:id - Update assignment
 * - DELETE /assignments/:id - Delete assignment
 * - POST /assignments - Create new assignment
 * - GET /users/:idParent/assignments - Get all assignments of a user
 */

/* ************* Extractors ************* */

const extractors = {
    getAssignment: deps.createZodParamsExtractor(AssignmentSchemas.getAssignmentSchema),
    updateAssignment: deps.createZodParamsExtractor(AssignmentSchemas.updateAssignmentSchema),
    deleteAssignment: deps.createZodParamsExtractor(AssignmentSchemas.deleteAssignmentSchema),
    createAssignment: deps.createZodParamsExtractor(AssignmentSchemas.createAssignmentSchema),
    getUserAssignments: deps.createZodParamsExtractor(AssignmentSchemas.getUserAssignmentsSchema),
};

/* ************* Controller ************* */

export class AssignmentController extends deps.Controller {
    constructor(
        get: AssignmentServices.GetAssignment,
        update: AssignmentServices.UpdateAssignment,
        remove: AssignmentServices.DeleteAssignment,
        create: AssignmentServices.CreateAssignment,
        getUserAssignments: AssignmentServices.GetUserAssignments,
    ) {
        super({ get, update, remove, create, getUserAssignments });
    }
}

/* ************* Routes ************* */

export function assignmentRoutes(
    app: deps.Express,
    controller: AssignmentController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignments/:id",
                controller,
                extractor: extractors.getAssignment,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/assignments/:id",
                controller,
                extractor: extractors.updateAssignment,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/assignments/:id",
                controller,
                extractor: extractors.deleteAssignment,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/assignments",
                controller,
                extractor: extractors.createAssignment,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:idParent/assignments",
                controller,
                extractor: extractors.getUserAssignments,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getUserAssignments),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
