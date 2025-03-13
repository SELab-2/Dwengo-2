import { Controller } from "./controllerExpress";
import { ServiceParams } from "../../config/service";
import * as UserServices from "../../core/services/user";
import { createParamsExtractor } from "../extractors";
import { Request, HttpMethod, RouteHandlers } from "../types";
const extractors = {
    getUser: createParamsExtractor(UserServices.GetUserParams, { _id: "id", _userType: "userType" }, {}, []),
    updateUser: createParamsExtractor(
        UserServices.UpdateUserParams,
        {
            _id: "id",
            _userType: "role",
            _email: "email",
            _firstName: "firstName",
            _familyName: "familyName",
            _passwordHash: "passwordHash",
            _schoolName: "schoolName",
        },
        {},
        ["_email", "_firstName", "_familyName", "_passwordHash", "_schoolName"],
    ),
    deleteUser: createParamsExtractor(UserServices.DeleteUserParams, { _id: "id", _userType: "role" }, {}, []),
    getClassUsers: createParamsExtractor(UserServices.GetClassUsersParams, { _classId: "idParent" }, {}, []),
    removeUserFromClass: createParamsExtractor(
        UserServices.RemoveUserFromParams,
        { _id: "id", _otherId: "idParent", _userType: "role" },
        {},
        [],
    ),
    getGroupUsers: createParamsExtractor(UserServices.GetGroupUsersParams, { _groupId: "idParent" }, {}, []),
    assignStudentToGroup: createParamsExtractor(
        UserServices.AssignStudentToGroupParams,
        { _studentId: "user", _groupId: "idParent" },
        {},
        [],
    ),
    removeUserFromGroup: createParamsExtractor(
        UserServices.RemoveUserFromParams,
        { _id: "id", _otherId: "idParent", _userType: "role" },
        {},
        [],
    ),
    getAssignmentUsers: createParamsExtractor(
        UserServices.GetAssignmentUsersParams,
        { _assignmentId: "idParent" },
        {},
        [],
    ),
    // assignUserToAssignment: createParamsExtractor(UserServices.AssignUserToAssignment),
    getAllUsers: createParamsExtractor(UserServices.GetAllUsersParams, {}, {}, []),
    createUser: createParamsExtractor(
        UserServices.CreateUserParams,
        {
            _email: "email",
            _firstName: "firstName",
            _familyName: "familyName",
            _passwordHash: "passwordHash",
            _schoolName: "schoolName",
            _userType: "role",
        },
        {},
        [],
    ),
};

/**
 * Controller responsible for general user-related API endpoints including
 * user listings, creation, and assignment to groups and assignments.
 * Follows RESTful patterns with paths:
 * - GET /users/:id - Get specific user
 * - PATCH /users/:id - Update user
 * - DELETE /users/:id - Delete user
 * - GET /classes/:idParent/users - Get all users in a class
 * - DELETE /classes/:idParent/users/:id - Remove user from class
 * - GET /groups/:idParent/users - Get all uses in a group
 * - POST /groups/:idParent/users - Assign user to group
 * - DELETE /groups/:idParent/users/:id - Remove user from group
 * - GET /assignments/:idParent/users - Get all users in an assignment
 * - POST /assignments/:idParent/users - Assign a user to an assignment
 * - GET /users - Get all users
 * - POST /users - Create new user
 */
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
        // assignUserToAssignment: UserServices.AssignUserToAssignment,
        getAll: UserServices.GetAllUsers,
        create: UserServices.CreateUser,
    ) {
        const handlers: RouteHandlers = {
            [HttpMethod.GET]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.getUser,
                    handler: (req: Request, data: ServiceParams) => this.getOne(req, data),
                },
                {
                    hasId: false,
                    hasParentId: false,
                    extractor: extractors.getAllUsers,
                    handler: (req: Request, data: ServiceParams) => this.getAll(req, data),
                },
                {
                    parent: "classes",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.getClassUsers,
                    handler: (req: Request, data: UserServices.GetClassUsersParams) =>
                        this.getChildren(req, data, getClassUsers),
                },
                {
                    parent: "groups",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.getGroupUsers,
                    handler: (req: Request, data: UserServices.GetGroupUsersParams) =>
                        this.getChildren(req, data, getGroupUsers),
                },
                {
                    parent: "assignments",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.getAssignmentUsers,
                    handler: (req: Request, data: UserServices.GetAssignmentUsersParams) =>
                        this.getChildren(req, data, getAssignmentUsers),
                },
            ],
            [HttpMethod.POST]: [
                {
                    hasId: false,
                    hasParentId: false,
                    extractor: extractors.createUser,
                    handler: (req: Request, data: ServiceParams) => this.create(req, data),
                },
                {
                    parent: "groups",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.assignStudentToGroup,
                    handler: (req: Request, data: UserServices.AssignStudentToGroupParams) =>
                        this.addChild(req, data, assignStudentToGroup),
                },
                // { parent: 'assignments', hasId: false, hasParentId: true, extractor: extractors.assignUserToAssignment,
                //   handler: (req: Request, data: ServiceParams) => this.addChild(req, data, assignUserToAssignment) }
            ],
            [HttpMethod.PATCH]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.updateUser,
                    handler: (req: Request, data: ServiceParams) => this.update(req, data),
                },
            ],
            [HttpMethod.DELETE]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.deleteUser,
                    handler: (req: Request, data: ServiceParams) => this.delete(req, data),
                },
                {
                    parent: "classes",
                    hasId: true,
                    hasParentId: true,
                    extractor: extractors.removeUserFromClass,
                    handler: (req: Request, data: UserServices.RemoveUserFromParams) =>
                        this.removeChild(req, data, removeUserFromClass),
                },
                {
                    parent: "groups",
                    hasId: true,
                    hasParentId: true,
                    extractor: extractors.removeUserFromGroup,
                    handler: (req: Request, data: UserServices.RemoveUserFromParams) =>
                        this.removeChild(req, data, removeUserFromGroup),
                },
            ],
        };

        super(
            {
                get,
                update,
                remove,
                getClassUsers,
                removeUserFromClass,
                getGroupUsers,
                assignStudentToGroup,
                removeUserFromGroup,
                getAssignmentUsers, // assignUserToAssignment,
                getAll,
                create,
            },
            handlers,
        );
    }
}
