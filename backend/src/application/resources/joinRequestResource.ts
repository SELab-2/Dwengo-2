import * as deps from "./dependencies";
import * as JoinRequestServices from "../../core/services/joinRequest";
import * as JoinRequestSchemas from "../schemas/joinRequestSchemas";

/**
 * RESTful routing configuration for JoinRequest related endpoints.
 * Maps HTTP requests to the JoinRequestController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /requests/:id - Get specific invite
 * - PATCH /requests/:id - Accept request
 * - DELETE /requests/:id - Delete invite
 * - POST /requests - Create new invite
 * - GET /users/:idParent/requests - Get all pending invites for a user
 */

/* ************* Extractors ************* */

const extractors = {
    getJoinRequest: deps.createZodParamsExtractor(JoinRequestSchemas.getJoinRequestSchema),
    updateJoinRequest: deps.createZodParamsExtractor(JoinRequestSchemas.acceptJoinRequestSchema),
    deleteJoinRequest: deps.createZodParamsExtractor(JoinRequestSchemas.deleteJoinRequestSchema),
    createJoinRequest: deps.createZodParamsExtractor(JoinRequestSchemas.createJoinRequestSchema),
    getUserJoinRequests: deps.createZodParamsExtractor(JoinRequestSchemas.getUserJoinRequestsSchema),
};

/* ************* Controller ************* */

export class JoinRequestController extends deps.Controller {
    constructor(
        get: JoinRequestServices.GetJoinRequest,
        update: JoinRequestServices.AcceptJoinRequest,
        remove: JoinRequestServices.DeleteJoinRequest,
        create: JoinRequestServices.CreateJoinRequest,
        getUserJoinRequests: JoinRequestServices.GetUserJoinRequests,
    ) {
        super({ get, update, remove, create, getUserJoinRequests });
    }
}

/* ************* Routes ************* */

export function joinRequestRoutes(
    app: deps.Express,
    controller: JoinRequestController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/requests/:id",
                controller,
                extractor: extractors.getJoinRequest,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/requests/:id",
                controller,
                extractor: extractors.updateJoinRequest,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/requests/:id",
                controller,
                extractor: extractors.deleteJoinRequest,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/requests",
                controller,
                extractor: extractors.createJoinRequest,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:idParent/requests",
                controller,
                extractor: extractors.getUserJoinRequests,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
