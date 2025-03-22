import { Express, RequestHandler } from "express";
import * as GroupServices from "../../core/services/group";
import { Controller } from "../controllers/controllerExpress";
import { createZodParamsExtractor } from "../extractors";
import { configureRoutes, DEFAULT_METHOD_MAP } from "../routes/routesExpress";
import { HttpMethod } from "../types";

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
    getGroup: createZodParamsExtractor(GroupServices.getGroupSchema),
    updateGroup: createZodParamsExtractor(GroupServices.updateGroupSchema),
    deleteGroup: createZodParamsExtractor(GroupServices.deleteGroupSchema),
    createGroup: createZodParamsExtractor(GroupServices.createGroupSchema),
    getUserGroups: createZodParamsExtractor(GroupServices.getUserGroupsSchema),
    getAssignmentGroups: createZodParamsExtractor(GroupServices.getAssignmentGroupSchema),
};

/* ************* Controller ************* */

export class GroupController extends Controller {
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

export function groupRoutes(app: Express, controller: GroupController, middleware: RequestHandler[] = []): void {
    configureRoutes(
        [
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/groups/:id",
                controller,
                extractor: extractors.getGroup,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.PATCH,
                urlPattern: "/groups/:id",
                controller,
                extractor: extractors.updateGroup,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.DELETE,
                urlPattern: "/groups/:id",
                controller,
                extractor: extractors.deleteGroup,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/groups",
                controller,
                extractor: extractors.createGroup,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/users/:idParent/groups",
                controller,
                extractor: extractors.getUserGroups,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getUserGroups),
                middleware,
            },
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/assignments/:idParent/groups",
                controller,
                extractor: extractors.getAssignmentGroups,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getAssignmentGroups),
                middleware,
            },
        ],
        DEFAULT_METHOD_MAP,
    );
}
