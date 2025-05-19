import * as deps from "./dependencies";
import * as ProgressServices from "../../core/services/progress";
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
 * - GET /classes/:idParent/score - Shows how much of the assignments for a class have been completed (on average)
 * - GET /classes/:idParent/completion - Shows how much of the assignments for a class have been completed (on average)
 * - GET /classes/:idParent/activity - Get an array with the amount of submissions for a class in the last 12 months (array of zero to twelve numbers)
 */

/* ************* Extractors ************* */

const extractors = {
    getUserProgress: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getAssignmentProgress: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getGroupProgress: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getUserAssignmentProgress: deps.createZodParamsExtractor(ProgressSchemas.getUserAssignmentProgressSchema),
    getClassScore: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getClassCompletion: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
    getSubmissionActivity: deps.createZodParamsExtractor(ProgressSchemas.getProgressSchema),
};

/* ************* Controller ************* */

export class ProgressController extends deps.Controller {
    constructor(
        getUserProgress: ProgressServices.GetUserProgress,
        getAssignmentProgress: ProgressServices.GetAssignmentProgress,
        getGroupProgress: ProgressServices.GetGroupProgress,
        get: ProgressServices.GetUserAssignmentProgress,
        getClassSCore: ProgressServices.GetClassScore,
        getClassCompletion: ProgressServices.GetClassCompletion,
        getSubmissionActivity: ProgressServices.GetSubmissionActivity,
    ) {
        super({
            getUserProgress,
            getAssignmentProgress,
            getGroupProgress,
            get,
            getClassSCore,
            getClassCompletion,
            getSubmissionActivity,
        });
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
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/classes/:idParent/score",
                controller,
                extractor: extractors.getSubmissionActivity,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getClassScore),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/classes/:idParent/completion",
                controller,
                extractor: extractors.getClassCompletion,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getClassCompletion),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/classes/:idParent/activity",
                controller,
                extractor: extractors.getSubmissionActivity,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getSubmissionActivity),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
