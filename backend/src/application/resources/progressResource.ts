import * as deps from "./dependencies";
import * as ProgressSchemas from "../schemas/progressSchemas";
import * as SubmissionServices from "../../core/services/progress";

/**
 * RESTful routing configuration for progress-related endpoints.
 * Maps HTTP requests to the provided controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /users/:idParent/assignments/:id/progress - Get the progress of a user for a specific assignment
 */

/* ************* Extractors ************* */

const extractors = {
    getUserProgress: deps.createZodParamsExtractor(ProgressSchemas.getUserProgressSchema),
};

/* ************* Controller ************* */

export class ProgressController extends deps.Controller {
    constructor(
        getUserProgress: SubmissionServices.GetUserProgress,
    ) {
        super({ getUserProgress });
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
                urlPattern: "/users/:idParent/assignments/:id/progress",
                controller,
                extractor: extractors.getUserProgress,
                handler: (req, data) => controller.getOne(req, data),
                // middleware, add after implementation
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
