import * as deps from "./dependencies";
import * as StepServices from "../../core/services/step";
import * as StepSchemas from "../schemas/stepSchemas";

/**
 * RESTful routing configuration for step-related endpoints.
 * Maps HTTP requests to the StepController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /steps/:id - Get specific step
 * - PATCH /steps/:id - Update step
 * - DELETE /steps/:id - Delete step
 * - POST /steps - Create new step
 * - GET /assignment/:idParent/steps?learningObject=learningObjectId - Get all steps of a learningObject within an assignment or all of the ones of an assignment
 */

/* ************* Extractors ************* */

const extractors = {
    getStep: deps.createZodParamsExtractor(StepSchemas.getStepSchema),
    updateStep: deps.createZodParamsExtractor(StepSchemas.updateStepSchema),
    deleteStep: deps.createZodParamsExtractor(StepSchemas.deleteStepSchema),
    createStep: deps.createZodParamsExtractor(StepSchemas.createStepSchema),
    getAssignmentSteps: deps.createZodParamsExtractor(StepSchemas.getAssignmentStepsSchema),
};

/* ************* Controller ************* */

export class StepController extends deps.Controller {
    constructor(
        get: StepServices.GetStep,
        update: StepServices.UpdateStep,
        remove: StepServices.DeleteStep,
        create: StepServices.CreateStep,
        getAssignmentSteps: StepServices.GetAssignmentSteps,
    ) {
        super({ get, update, remove, create, getAssignmentSteps });
    }
}

/* ************* Routes ************* */

export function stepRoutes(
    app: deps.Express,
    controller: StepController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/steps/:id",
                controller,
                extractor: extractors.getStep,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/steps/:id",
                controller,
                extractor: extractors.updateStep,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/steps/:id",
                controller,
                extractor: extractors.deleteStep,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/steps",
                controller,
                extractor: extractors.createStep,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignment/:idParent/steps",
                controller,
                extractor: extractors.getAssignmentSteps,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getAssignmentSteps),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
