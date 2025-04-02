import * as deps from "./dependencies";
import * as DwengoServices from "../../core/services/learningObject";
import * as DwengoSchemas from "../schemas/learningObjectSchemas";

/**
 * RESTful routing configuration for dwengo-related endpoints.
 * Maps HTTP requests to the LearningObjectControllers's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /objects/id - Get a learningobject
 */

/* ************* Extractors ************* */

const extractors = {
    getObject: deps.createZodParamsExtractor(DwengoSchemas.getLearningObjectSchema),
};

/* ************* Controller ************* */

export class DwengoController extends deps.Controller {
    constructor(getObject: DwengoServices.GetLearningObject) {
        super({ get: getObject });
    }
}

/* ************* Routes ************* */

export function dwengoRoutes(
    app: deps.Express,
    controller: DwengoController,
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
