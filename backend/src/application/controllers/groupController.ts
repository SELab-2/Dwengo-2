// import { Controller } from "./controllerExpress";
// import { ServiceParams } from "../../config/service";
// import * as GroupServices from "../../core/services/group";
// import { createParamsExtractor } from "../extractors";
// import { RouteHandlers, Request, HttpMethod } from "../types";
//
// const extractors = {
//     getGroup: createParamsExtractor(GroupServices.GetGroupParams, { _id: "id" }, {}, []),
//     getUserGroups: createParamsExtractor(GroupServices.GetUserGroupsParams, { _userId: "idParent" }, {}, []),
//     getAssignmentGroups: createParamsExtractor(
//         GroupServices.GetAssignmentGroupsParams,
//         { _assignmentId: "idParent" },
//         {},
//         [],
//     ),
//     update: createParamsExtractor(GroupServices.UpdateGroupParams, { _id: "id", _memberIds: "members" }, {}, []),
//     remove: createParamsExtractor(GroupServices.DeleteGroupParams, { _id: "id" }, {}, []),
//     create: createParamsExtractor(
//         GroupServices.CreateGroupParams,
//         { _memberIds: "members", _assignmentId: "assignment" },
//         {},
//         [],
//     ),
// };
//
// /**
//  * Controller responsible for group-related API endpoints including CRUD operations
//  * and group listings by user or class. Follows RESTful patterns with paths:
//  * - GET /groups/:id - Get single group
//  * - GET /users/:idParent/groups - Get groups for a user
//  * - GET /assignments/:idParent/groups - Get groups for an assignment
//  * - PATCH /groups/:id - Update a group
//  * - DELETE /groups/:id - Delete a group
//  * - POST /groups - Create a new group
//  */
// export class GroupController extends Controller {
//     constructor(
//         get: GroupServices.GetGroup,
//         getUserGroups: GroupServices.GetUserGroups,
//         getAssignmentGroups: GroupServices.GetAssignmentGroups,
//         update: GroupServices.UpdateGroup,
//         remove: GroupServices.DeleteGroup,
//         create: GroupServices.CreateGroup,
//     ) {
//         const handlers: RouteHandlers = {
//             [HttpMethod.GET]: [
//                 {
//                     hasId: true,
//                     hasParentId: false,
//                     extractor: extractors.getGroup,
//                     handler: (req: Request, data: ServiceParams) => this.getOne(req, data),
//                 },
//                 {
//                     parent: "users",
//                     hasId: false,
//                     hasParentId: true,
//                     extractor: extractors.getUserGroups,
//                     handler: (req: Request, data: GroupServices.GetUserGroupsParams) =>
//                         this.getChildren(req, data, getUserGroups),
//                 },
//                 {
//                     parent: "assignments",
//                     hasId: false,
//                     hasParentId: true,
//                     extractor: extractors.getAssignmentGroups,
//                     handler: (req: Request, data: GroupServices.GetAssignmentGroupsParams) =>
//                         this.getChildren(req, data, getAssignmentGroups),
//                 },
//             ],
//             [HttpMethod.PATCH]: [
//                 {
//                     hasId: true,
//                     hasParentId: false,
//                     extractor: extractors.update,
//                     handler: (req: Request, data: ServiceParams) => this.update(req, data),
//                 },
//             ],
//             [HttpMethod.POST]: [
//                 {
//                     hasId: false,
//                     hasParentId: false,
//                     extractor: extractors.create,
//                     handler: (req: Request, data: ServiceParams) => this.create(req, data),
//                 },
//             ],
//             [HttpMethod.DELETE]: [
//                 {
//                     hasId: true,
//                     hasParentId: false,
//                     extractor: extractors.remove,
//                     handler: (req: Request, data: ServiceParams) => this.delete(req, data),
//                 },
//             ],
//         };
//
//         super({ get, getUserGroups, getAssignmentGroups, update, remove, create }, handlers);
//     }
// }
//
