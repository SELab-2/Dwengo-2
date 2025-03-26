import * as deps from "./dependencies";
import * as GroupServices from "../../core/services/group";
import * as GroupSchemas from "../schemas/groupSchemas";

/**
 * RESTful routing configuration for group-related endpoints.
 * Maps HTTP requests to the GroupController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /groups/:id - Get specific group
 * - PATCH /groups/:id - Update group
 * - DELETE /groups/:id - Delete group
 * - POST /groups - Create new group
 * - GET /users/:idParent/groups - Get all groups of a user
 * - GET /assignments/:idParent/groups - Get all groups of an assignment
 */

/* ************* Extractors ************* */

const extractors = {
    getGroup: deps.createZodParamsExtractor(GroupSchemas.getGroupSchema),
    updateGroup: deps.createZodParamsExtractor(GroupSchemas.updateGroupSchema),
    deleteGroup: deps.createZodParamsExtractor(GroupSchemas.deleteGroupSchema),
    createGroup: deps.createZodParamsExtractor(GroupSchemas.createGroupSchema),
    getUserGroups: deps.createZodParamsExtractor(GroupSchemas.getUserGroupsSchema),
    getAssignmentGroups: deps.createZodParamsExtractor(GroupSchemas.getAssignmentGroupsSchema),
};

/* ************* Controller ************* */

export class GroupController extends deps.Controller {
    constructor(
        get: GroupServices.GetGroup,
        update: GroupServices.UpdateGroup,
        remove: GroupServices.DeleteGroup,
        create: GroupServices.CreateGroup,
        getUserGroups: GroupServices.GetUserGroups,
        getAssignmentGroups: GroupServices.GetAssignmentGroups,
    ) {
        super({ get, update, remove, create, getUserGroups, getAssignmentGroups });
    }
}

/* ************* Routes ************* */

export function groupRoutes(
    app: deps.Express,
    controller: GroupController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/groups/:id",
                controller,
                extractor: extractors.getGroup,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/groups/:id",
                controller,
                extractor: extractors.updateGroup,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/groups/:id",
                controller,
                extractor: extractors.deleteGroup,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/groups",
                controller,
                extractor: extractors.createGroup,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:idParent/groups",
                controller,
                extractor: extractors.getUserGroups,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getUserGroups),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignments/:idParent/groups",
                controller,
                extractor: extractors.getAssignmentGroups,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getAssignmentGroups),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
