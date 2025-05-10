import * as deps from "./dependencies";
import * as JoinCodeServices from "../../core/services/joinCode";
import * as JoinCodeSchemas from "../schemas/joinCodeSchemas";

/**
 * RESTful routing configuration for JoinCode related endpoints.
 * Maps HTTP requests to the JoinCodeController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /codes/:id - Get specific join-code
 * - PATCH /codes/:id - Expire code
 * - DELETE /codes/:id - Delete code
 * - POST /codes - Create a new code
 * - GET /classes/:idParent/codes - Get codes for a class
 */

/* ************* Extractors ************* */

const extractors = {
    getJoinCode: deps.createZodParamsExtractor(JoinCodeSchemas.getJoinCodeSchema),
    updateJoinCode: deps.createZodParamsExtractor(JoinCodeSchemas.updateJoinCodeSchema),
    deleteJoinCode: deps.createZodParamsExtractor(JoinCodeSchemas.deleteJoinCodeSchema),
    createJoinCode: deps.createZodParamsExtractor(JoinCodeSchemas.createJoinCodeSchema),
    getClassJoinCodes: deps.createZodParamsExtractor(JoinCodeSchemas.getClassJoinCodesSchema),
};

/* ************* Controller ************* */

export class JoinCodeController extends deps.Controller {
    constructor(
        get: JoinCodeServices.GetJoinCode,
        update: JoinCodeServices.UpdateJoinCode,
        remove: JoinCodeServices.DeleteJoinCode,
        create: JoinCodeServices.CreateJoinCode,
        getClassJoinCodes: JoinCodeServices.GetClassJoinCodes,
    ) {
        super({ get, update, remove, create, getClassJoinCodes });
    }
}

/* ************* Routes ************* */

export function JoinCodeRoutes(
    app: deps.Express,
    controller: JoinCodeController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/codes/:id",
                controller,
                extractor: extractors.getJoinCode,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/codes/:id",
                controller,
                extractor: extractors.updateJoinCode,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/codes/:id",
                controller,
                extractor: extractors.deleteJoinCode,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/codes",
                controller,
                extractor: extractors.createJoinCode,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/classes/:idParent/codes",
                controller,
                extractor: extractors.getClassJoinCodes,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getClassJoinCodes),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
