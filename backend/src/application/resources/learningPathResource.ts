import * as deps from "./dependencies";
import * as LearningPathServices from "../../core/services/learningPath";
import * as LearningPathSchemas from "../schemas/learningPathSchemas";

/**
 * RESTful routing configuration for learningPath-related endpoints.
 * Maps HTTP requests to the LearningPathControllers's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints
 * - GET /learningPath - Search for all available learningPaths with optional filtering
 * - GET /learningPath/:id - Get a learningPath
 */

/* ************* Extractors ************* */

const extractors = {
    getLearningPath: deps.createZodParamsExtractor(LearningPathSchemas.getLearningPathSchema),
    getAllLearningPaths: deps.createZodParamsExtractor(LearningPathSchemas.getAllLearningPathsSchema),
};

/* ************* Controller ************* */

export class LearningPathController extends deps.Controller {
    constructor(
        getLearningPath: LearningPathServices.GetLearningPath,
        getAllLearningPaths: LearningPathServices.GetAllLearningPaths,
    ) {
        super({ get: getLearningPath, getAll: getAllLearningPaths });
    }
}

/* ************* Routes ************* */

export function learningPathRoutes(app: deps.Express, controller: LearningPathController): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/learningPath",
                controller,
                extractor: extractors.getAllLearningPaths,
                handler: (req, data) => controller.getAll(req, data),
            },
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
