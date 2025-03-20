// import { Express } from "express";
// import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
// import { JoinRequestController } from "../controllers/joinRequestController";
// import { HttpMethod } from "../types";
//
// /**
//  * RESTful routing configuration for JoinRequest related endpoints.
//  * Maps HTTP requests to the JoinRequestController's handle method after
//  * converting Express request/response objects to our internal format.
//  *
//  * Supported endpoints:
//  * - GET /users/:idParent/requests/:id - Get specific invite for a user
//  * - GET /users/:idParent/requests - Get all pending invites for a user
//  * - DELETE /requests/:id - Delete invite
//  * - POST /requests - Create new invite
//  */
// export function joinRequestRoutes(app: Express, controller: JoinRequestController): void {
//     configureRoutes(
//         [
//             { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/requests/:id", controller },
//             { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/requests", controller },
//             { app, method: HttpMethod.DELETE, urlPattern: "/requests/:id", controller },
//             { app, method: HttpMethod.POST, urlPattern: "/requests", controller },
//         ],
//         DEFAULT_METHOD_MAP,
//     );
// }
//
