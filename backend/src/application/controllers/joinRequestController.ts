import { Controller } from "./controllerExpress";
import { ServiceParams } from "../../config/service";
import * as JoinRequestServices from "../../core/services/joinRequest";
import { createParamsExtractor } from "../extractors";
import { Request, HttpMethod, RouteHandlers } from "../types";

const extractors = {
    getJoinRequest: createParamsExtractor(
        JoinRequestServices.GetJoinRequestsParams,
        { _userId: "idParent", _requestId: "id" },
        {},
        [],
    ),
    getJoinRequests: createParamsExtractor(JoinRequestServices.GetJoinRequestParams, { _userId: "idParent" }, {}, []),
    remove: createParamsExtractor(JoinRequestServices.DeleteJoinRequestParams, { _id: "id" }, {}),
    create: createParamsExtractor(
        JoinRequestServices.CreateJoinRequestParams,
        { _requesterId: "requester", _classId: "class", _type: "type" },
        {},
        [],
    ),
};

/**
 * Controller responsible for pending invite-related API endpoints including CRUD operations
 * and invite listings by user. Follows RESTful patterns with paths:
 * Supported endpoints:
 * - GET /users/:idParent/invites/:id - Get specific invite for a user
 * - GET /users/:idParent/invites - Get all pending invites for a user
 * - DELETE /invites/:id - Delete invite
 * - POST /invites - Create new invite
 */
export class JoinRequestController extends Controller {
    constructor(
        get: JoinRequestServices.GetJoinRequest,
        getJoinRequests: JoinRequestServices.GetJoinRequests,
        remove: JoinRequestServices.DeleteJoinRequest,
        create: JoinRequestServices.CreateJoinRequest,
    ) {
        const handlers: RouteHandlers = {
            [HttpMethod.GET]: [
                {
                    parent: "users",
                    hasId: true,
                    hasParentId: true,
                    extractor: extractors.getJoinRequest,
                    handler: (req: Request, data: ServiceParams) => this.getOne(req, data),
                },
                {
                    parent: "users",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.getJoinRequests,
                    handler: (req: Request, data: JoinRequestServices.GetJoinRequestsParams) =>
                        this.getChildren(req, data, getJoinRequests),
                },
            ],
            [HttpMethod.DELETE]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.remove,
                    handler: (req: Request, data: ServiceParams) => this.delete(req, data),
                },
            ],
            [HttpMethod.POST]: [
                {
                    hasId: false,
                    hasParentId: false,
                    extractor: extractors.create,
                    handler: (req: Request, data: ServiceParams) => this.create(req, data),
                },
            ],
        };

        super({ get, getJoinRequests: getJoinRequests, remove, create }, handlers);
    }
}
