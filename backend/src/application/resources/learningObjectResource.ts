import * as deps from "./dependencies";
import * as LearningObjectServices from "../../core/services/learningObject";
import * as LearningObjectSchemas from "../schemas/learningObjectSchemas";

/**
 * RESTful routing configuration for learningObject-related endpoints.
 * Maps HTTP requests to the LearningObjectControllers's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /learningObject/ - Search for all learningObjects, supports all params from the Dwengo API docs
 * - GET /learningObject/:id - Get a learningobject
 */

/* ************* Extractors ************* */

const extractors = {
    getLearningObject: deps.createZodParamsExtractor(LearningObjectSchemas.getLearningObjectSchema),
    getAllLearningObjects: deps.createZodParamsExtractor(LearningObjectSchemas.getAllLearningObjectsSchema),
};

/* ************* Controller ************* */

export class LearningObjectController extends deps.Controller {
    constructor(
        getLearningObject: LearningObjectServices.GetLearningObject,
        getAllLearningObjects: LearningObjectServices.GetAllLearningObjects,
    ) {
        super({ get: getLearningObject, getAll: getAllLearningObjects });
    }
}

/* ************* Routes ************* */

export function learningObjectRoutes(app: deps.Express, controller: LearningObjectController): void {
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
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/learningObject",
                controller,
                extractor: extractors.getAllLearningObjects,
                handler: (req, data) => controller.getAll(req, data),
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
