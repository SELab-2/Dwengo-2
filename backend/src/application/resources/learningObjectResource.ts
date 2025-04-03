import * as deps from "./dependencies";
import * as LearningObjectServices from "../../core/services/learningObject";
import * as LearningObjectSchemas from "../schemas/learningObjectSchemas";

/**
 * RESTful routing configuration for learningObject-related endpoints.
 * Maps HTTP requests to the LearningObjectControllers's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /learningObject/:id - Get a learningobject
 */

/* ************* Extractors ************* */

const extractors = {
    getLearningObject: deps.createZodParamsExtractor(LearningObjectSchemas.getLearningObjectSchema),
};

/* ************* Controller ************* */

export class LearningObjectController extends deps.Controller {
    constructor(getLearningObject: LearningObjectServices.GetLearningObject) {
        super({ get: getLearningObject });
    }
}

/* ************* Routes ************* */

export function learningObjectRoutes(
    app: deps.Express,
    controller: LearningObjectController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/learningObject/:id",
                controller,
                extractor: extractors.getLearningObject,
                handler: (req, data) => controller.getOne(req, data),
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
