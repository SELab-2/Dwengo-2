import * as deps from "./dependencies";
import * as SubmissionServices from "../../core/services/submission";
import * as SubmissionSchemas from "../schemas/submissionSchemas";

/**
 * RESTful routing configuration for common submission-related endpoints.
 * Maps HTTP requests to the provided controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /submissions/:id - Get specific submission
 * - DELETE /submissions/:id - Delete submission
 * - POST /submissions - Create a new submission
 * - GET /users/:idParent/submissions - Get all user submissions
 */

/* ************* Extractors ************* */

const extractors = {
    getSubmission: deps.createZodParamsExtractor(SubmissionSchemas.getSubmissionSchema),
    deleteSubmission: deps.createZodParamsExtractor(SubmissionSchemas.deleteSubmissionSchema),
    createSubmission: deps.createZodParamsExtractor(SubmissionSchemas.createSubmissionSchema),
    getUserSubmissions: deps.createZodParamsExtractor(SubmissionSchemas.getUserSubmissionsSchema),
};

/* ************* Controller ************* */

export class SubmissionController extends deps.Controller {
    constructor(
        get: SubmissionServices.GetSubmission,
        remove: SubmissionServices.DeleteSubmission,
        create: SubmissionServices.CreateSubmission,
        getUserSubmissions: undefined, // TODO
    ) {
        super({ get, remove, create, getUserSubmissions });
    }
}

/* ************* Routes ************* */

export function submissionRoutes(
    app: deps.Express,
    controller: SubmissionController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/submissions/:id",
                controller,
                extractor: extractors.getSubmission,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/submissions/:id",
                controller,
                extractor: extractors.deleteSubmission,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/submissions",
                controller,
                extractor: extractors.createSubmission,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:idParent/submissions",
                controller,
                extractor: extractors.getUserSubmissions,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getUserSubmissions),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
