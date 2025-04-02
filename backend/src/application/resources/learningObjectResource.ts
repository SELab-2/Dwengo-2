import * as deps from "./dependencies";
import * as LearningObjectServices from "../../core/services/learningObject";
import * as LearningObjectSchemas from "../schemas/learningObjectSchemas";

/**
 * RESTful routing configuration for learningObject-related endpoints.
 * Maps HTTP requests to the LearningObjectControllers's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /objects/id - Get a learningobject
 */

/* ************* Extractors ************* */

const extractors = {
    getObject: deps.createZodParamsExtractor(LearningObjectSchemas.getLearningObjectSchema),
};

/* ************* Controller ************* */

export class LearningObjectController extends deps.Controller {
    constructor(getObject: LearningObjectServices.GetLearningObject) {
        super({ get: getObject });
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
                urlPattern: "/objects/:id",
                controller,
                extractor: extractors.getObject,
                handler: (req, data) => controller.getOne(req, data),
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
