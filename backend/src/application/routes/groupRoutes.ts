// import { Express } from "express";
// import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
// import { GroupController } from "../controllers/groupController";
// import { HttpMethod } from "../types";
//
// /**
//  * RESTful routing configuration for group-related endpoints.
//  * Maps HTTP requests to the GroupController's handle method after
//  * converting Express request/response objects to our internal format.
//  *
//  * Supported endpoints:
//  * - GET /users/:idParent/groups/:id - Get specific group from a user
//  * - GET /users/:idParent/groups - Get all groups of a user
//  * - GET /assignments/:idParent/groups/:id - Get specific group from an assignment
//  * - GET /assignments/:idParent/groups - Get all groups of an assignment
//  * - PATCH /groups/:id - Update group
//  * - DELETE /groups/:id - Delete group
//  * - POST /groups - Create new group
//  */
// export function groupRoutes(app: Express, controller: GroupController): void {
//     configureRoutes(
//         [
//             { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/groups/:id", controller },
//             { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/groups", controller },
//             { app, method: HttpMethod.GET, urlPattern: "/assignments/:idParent/groups/:id", controller },
//             { app, method: HttpMethod.GET, urlPattern: "/assignments/:idParent/groups", controller },
//             { app, method: HttpMethod.PATCH, urlPattern: "/groups/:id", controller },
//             { app, method: HttpMethod.DELETE, urlPattern: "/groups/:id", controller },
//             { app, method: HttpMethod.POST, urlPattern: "/groups", controller },
//         ],
//         DEFAULT_METHOD_MAP,
//     );
// }
//