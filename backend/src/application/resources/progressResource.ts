import * as deps from "./dependencies";
import * as SubmissionServices from "../../core/services/progress";
import * as ProgressSchemas from "../schemas/progressSchemas";

/**
 * RESTful routing configuration for progress-related endpoints.
 * Maps HTTP requests to the provided controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /users/:idParent/progress - Get the progress of all assignments of a user.
 * - GET /assignments/:idParent/progress - Get the progress of all users in an assignment
 * - GET /groups/:idParent/progress - Get the progress of all users in a group
 * - GET /users/:userId/assignment/:assignmentId/progress - Get the progress of a user for a specific assignment
 *   idParent := {userId-assignmentId}
 */

/* ************* Extractors ************* */

const extractors = {
    getUserProgress: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getAssignmentProgress: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getGroupProgress: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getUserAssignmentProgress: deps.createZodParamsExtractor(ProgressSchemas.getUserAssignmentProgressSchema),
};

/* ************* Controller ************* */

export class ProgressController extends deps.Controller {
    constructor(
        getUserProgress: SubmissionServices.GetUserProgress,
        getAssignmentProgress: SubmissionServices.GetAssignmentProgress,
        getGroupProgress: SubmissionServices.GetGroupProgress,
        get: SubmissionServices.GetUserAssignmentProgress,
    ) {
        super({ getUserProgress, getAssignmentProgress, getGroupProgress, get });
    }
}

/* ************* Routes ************* */

export function progressRoutes(
    app: deps.Express,
    controller: ProgressController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:idParent/progress",
                controller,
                extractor: extractors.getUserProgress,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getUserProgress),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignments/:idParent/progress",
                controller,
                extractor: extractors.getAssignmentProgress,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getAssignmentProgress),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/groups/:idParent/progress",
                controller,
                extractor: extractors.getGroupProgress,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getGroupProgress),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:userId/assignments/:assignmentId/progress",
                controller,
                extractor: extractors.getUserAssignmentProgress,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
