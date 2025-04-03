import * as deps from "./dependencies";
import * as LearningPathServices from "../../core/services/learningPath";
import * as LearningPathSchemas from "../schemas/learningPathSchemas";

/**
 * RESTful routing configuration for learningPath-related endpoints.
 * Maps HTTP requests to the LearningPathControllers's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /learningPath/:id - Get a learningPath
 */

/* ************* Extractors ************* */

const extractors = {
    getLearningPath: deps.createZodParamsExtractor(LearningPathSchemas.getLearningPathSchema),
};

/* ************* Controller ************* */

export class LearningPathController extends deps.Controller {
    constructor(getLearningPath: LearningPathServices.GetLearningPath) {
        super({ get: getLearningPath });
    }
}

/* ************* Routes ************* */

export function learningPathRoutes(
    app: deps.Express,
    controller: LearningPathController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/learningPath/:id",
                controller,
                extractor: extractors.getLearningPath,
                handler: (req, data) => controller.getOne(req, data),
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
