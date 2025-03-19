import { Express, RequestHandler } from "express";
import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
import * as UserServices from "../../core/services/user";
import { Controller } from "../controllers/controllerExpress";
import { createZodParamsExtractor } from "../extractors";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for common user-related endpoints.
 * Maps HTTP requests to the provided controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /users/:id - Get specific user
 * - PATCH /users/:id - Update user
 * - DELETE /users/:id - Delete user
 * - GET /classes/:idParent/users - Get all users in a class
 * - DELETE /classes/:idParent/users/:id - Remove user from class
 * - GET /groups/:idParent/users - Get all uses in a group
 * - POST /groups/:idParent/users - Assign user to group
 * - DELETE /groups/:idParent/users/:id - Remove user from group
 * - GET /assignments/:idParent/users - Get all users in an assignment
 * - GET /users - Get all users
 * - POST /users - Create new user
 */

/* ************* Extractors ************* */

const extractors = {
    getUser: createZodParamsExtractor(UserServices.getUserSchema),
    updateUser: createZodParamsExtractor(UserServices.updateUserSchema),
    deleteUser: createZodParamsExtractor(UserServices.deleteUserSchema),
    getClassUsers: createZodParamsExtractor(UserServices.getClassUsersSchema),
    removeUserFromClass: createZodParamsExtractor(UserServices.removeUserFromSchema),
    getGroupUsers: createZodParamsExtractor(UserServices.getGroupUsersSchema),
    assignStudentToGroup: createZodParamsExtractor(UserServices.assignStudentToGroupSchema),
    removeUserFromGroup: createZodParamsExtractor(UserServices.removeUserFromSchema),
    getAssignmentUsers: createZodParamsExtractor(UserServices.getAssignmentUsersSchema),
    getAllUsers: createZodParamsExtractor(UserServices.getAllUsersSchema),
    createUser: createZodParamsExtractor(UserServices.createUserSchema),
};

/* ************* Controller ************* */

export class UsersController extends Controller {
    constructor(
        get: UserServices.GetUser,
        update: UserServices.UpdateUser,
        remove: UserServices.DeleteUser,
        getClassUsers: UserServices.GetClassUsers,
        removeUserFromClass: UserServices.RemoveUserFromClass,
        getGroupUsers: UserServices.GetGroupUsers,
        assignStudentToGroup: UserServices.AssignStudentToGroup,
        removeUserFromGroup: UserServices.RemoveUserFromGroup,
        getAssignmentUsers: UserServices.GetAssignmentUsers,
        getAll: UserServices.GetAllUsers,
        create: UserServices.CreateUser,
    ) {
        super({
            get,
            update,
            remove,
            getClassUsers,
            removeUserFromClass,
            getGroupUsers,
            assignStudentToGroup,
            removeUserFromGroup,
            getAssignmentUsers,
            getAll,
            create,
        });
    }
}

/* ************* Routes ************* */

export function usersRoutes(app: Express, controller: UsersController, middleware: RequestHandler[] = []): void {
    configureRoutes(
        [
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/users/:id",
                controller,
                extractor: extractors.getUser,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.PATCH,
                urlPattern: "/users/:id",
                controller,
                extractor: extractors.updateUser,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.DELETE,
                urlPattern: "/users/:id",
                controller,
                extractor: extractors.deleteUser,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/classes/:idParent/users",
                controller,
                extractor: extractors.getClassUsers,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getClassUsers),
                middleware,
            },
            {
                app,
                method: HttpMethod.DELETE,
                urlPattern: "/classes/:idParent/users/:id",
                controller,
                extractor: extractors.removeUserFromClass,
                handler: (req, data) => controller.removeChild(req, data, controller.services.removeUserFromClass),
                middleware,
            },
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/groups/:idParent/users",
                controller,
                extractor: extractors.getGroupUsers,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getGroupUsers),
                middleware,
            },
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/groups/:idParent/users",
                controller,
                extractor: extractors.assignStudentToGroup,
                handler: (req, data) => controller.addChild(req, data, controller.services.assignStudentToGroup),
                middleware,
            },
            {
                app,
                method: HttpMethod.DELETE,
                urlPattern: "/groups/:idParent/users/:id",
                controller,
                extractor: extractors.removeUserFromGroup,
                handler: (req, data) => controller.removeChild(req, data, controller.services.removeUserFromGroup),
                middleware,
            },
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/assignments/:idParent/users",
                controller,
                extractor: extractors.getAssignmentUsers,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getAssignmentUsers),
                middleware,
            },
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/users",
                controller,
                extractor: extractors.getAllUsers,
                handler: (req, data) => controller.getAll(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/users",
                controller,
                extractor: extractors.createUser,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
        ],
        DEFAULT_METHOD_MAP,
    );
}
