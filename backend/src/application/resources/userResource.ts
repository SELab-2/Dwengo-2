import * as deps from "./dependencies";
import * as UserServices from "../../core/services/user";
import * as UserSchemas from "../schemas/userSchemas";

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
 */

/* ************* Extractors ************* */

const extractors = {
    getUser: deps.createZodParamsExtractor(UserSchemas.getUserSchema),
    updateUser: deps.createZodParamsExtractor(UserSchemas.updateUserSchema),
    deleteUser: deps.createZodParamsExtractor(UserSchemas.deleteUserSchema),
    getClassUsers: deps.createZodParamsExtractor(UserSchemas.getClassUsersSchema),
    removeUserFromClass: deps.createZodParamsExtractor(UserSchemas.removeUserFromSchema),
    getGroupUsers: deps.createZodParamsExtractor(UserSchemas.getGroupUsersSchema),
    assignStudentToGroup: deps.createZodParamsExtractor(UserSchemas.assignStudentToGroupSchema),
    removeUserFromGroup: deps.createZodParamsExtractor(UserSchemas.removeUserFromSchema),
    getAssignmentUsers: deps.createZodParamsExtractor(UserSchemas.getAssignmentUsersSchema),
    getAllUsers: deps.createZodParamsExtractor(UserSchemas.getAllUsersSchema),
};

/* ************* Controller ************* */

export class UserController extends deps.Controller {
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
        });
    }
}

/* ************* Routes ************* */

export function userRoutes(
    app: deps.Express,
    controller: UserController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:id",
                controller,
                extractor: extractors.getUser,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/users/:id",
                controller,
                extractor: extractors.updateUser,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/users/:id",
                controller,
                extractor: extractors.deleteUser,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/classes/:idParent/users",
                controller,
                extractor: extractors.getClassUsers,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getClassUsers),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/classes/:idParent/users/:id",
                controller,
                extractor: extractors.removeUserFromClass,
                handler: (req, data) => controller.removeChild(req, data, controller.services.removeUserFromClass),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/groups/:idParent/users",
                controller,
                extractor: extractors.getGroupUsers,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getGroupUsers),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/groups/:idParent/users",
                controller,
                extractor: extractors.assignStudentToGroup,
                handler: (req, data) => controller.addChild(req, data, controller.services.assignStudentToGroup),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/groups/:idParent/users/:id",
                controller,
                extractor: extractors.removeUserFromGroup,
                handler: (req, data) => controller.removeChild(req, data, controller.services.removeUserFromGroup),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignments/:idParent/users",
                controller,
                extractor: extractors.getAssignmentUsers,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getAssignmentUsers),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users",
                controller,
                extractor: extractors.getAllUsers,
                handler: (req, data) => controller.getAll(req, data),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
