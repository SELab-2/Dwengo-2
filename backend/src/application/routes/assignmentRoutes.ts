// import { Express } from "express";
// import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
// import { AssignmentController } from "../controllers/assignmentController";
// import { HttpMethod } from "../types";
//
// /**
//  * RESTful routing configuration for assignment-related endpoints.
//  * Maps HTTP requests to the AssignmentController's handle method after
//  * converting Express request/response objects to our internal format.
//  *
//  * Supported endpoints:
//  * - GET /users/:idParent/assignments/:id - Get specific assignment of a user
//  * - GET /users/:idParent/assignments - Get all assignments of a user
//  * - PATCH /assignments/:id - Update assignment
//  * - DELETE /assignments/:id - Delete assignment
//  * - POST /assignments - Create new assignment
//  */
// export function assignmentRoutes(app: Express, controller: AssignmentController): void {
//     configureRoutes(
//         [
//             { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/assignments/:id", controller },
//             { app, method: HttpMethod.GET, urlPattern: "/users/:idParent/assignments", controller },
//             { app, method: HttpMethod.PATCH, urlPattern: "/assignments/:id", controller },
//             { app, method: HttpMethod.DELETE, urlPattern: "/assignments/:id", controller },
//             { app, method: HttpMethod.POST, urlPattern: "/assignments", controller },
//         ],
//         DEFAULT_METHOD_MAP,
//     );
// }
//