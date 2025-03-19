import { Express } from "express";
import { getAuthManager } from "../application/auth";
import { authMiddleware } from "../application/middleware/authenticationMiddleware";
import { controllers } from "../config/controllers";
// eslint-disable-next-line import/order
import {
    // assignmentRoutes,
    // groupRoutes,
    // classRoutes,
    // joinRequestRoutes,
    // messageRoutes,
    // questionThreadRoutes,
    usersRoutes,
    authenticationRoutes,
} from "../application/routes";
/**
 * Setup all routes for the Dwengo-2 backend application
 * @param app Express instance
 */
export const setupRoutes = (app: Express) => {
    const authManager = getAuthManager(controllers.users.services.get);
    const auth = authMiddleware(authManager);
    usersRoutes(app, controllers.users, [auth]);
    // classRoutes(app, controllers.class);
    // groupRoutes(app, controllers.group);
    // assignmentRoutes(app, controllers.assignment);
    // joinRequestRoutes(app, controllers.joinRequest);
    // questionThreadRoutes(app, controllers.questionThread);
    // messageRoutes(app, controllers.message);
    authenticationRoutes(app, controllers.authentication);
};
