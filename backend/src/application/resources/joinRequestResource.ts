import * as deps from "./dependencies";
import * as JoinRequestServices from "../../core/services/joinRequest";

/**
 * RESTful routing configuration for JoinRequest related endpoints.
 * Maps HTTP requests to the JoinRequestController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /requests/:id - Get specific invite
 * - DELETE /requests/:id - Delete invite
 * - POST /requests - Create new invite
 * - GET /users/:idParent/requests - Get all pending invites for a user
 */

/* ************* Extractors ************* */

const extractors = {
    getJoinRequest: undefined, // TODO
    deleteJoinRequest: undefined, // TODO
    createJoinRequest: undefined, // TODO
    getUserJoinRequests: undefined, // TODO
};

/* ************* Controller ************* */

export class JoinRequestController extends deps.Controller {
    constructor(
        get: JoinRequestServices.GetJoinRequest,
        remove: JoinRequestServices.DeleteJoinRequest,
        create: JoinRequestServices.CreateJoinRequest,
        getUserJoinRequests: JoinRequestServices.GetUserJoinRequests,
    ) {
        super({ get, remove, create, getUserJoinRequests });
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
