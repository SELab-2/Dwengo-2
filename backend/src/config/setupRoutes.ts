import { Express } from "express";
import { middleware } from "./middleware";
import { controllers } from "../config/controllers";
// eslint-disable-next-line import/order
import {
    // classRoutes,
    // joinRequestRoutes,
    // messageRoutes,
    // questionThreadRoutes,
    assignmentRoutes,
    authenticationRoutes,
    groupRoutes,
    usersRoutes,
} from "../application/resources";

/**
 * Setup all routes for the Dwengo-2 backend application
 * @param app Express instance
 */
export const setupRoutes = (app: Express) => {
    assignmentRoutes(app, controllers.assignment, [middleware.auth]);
    authenticationRoutes(app, controllers.authentication);
    groupRoutes(app, controllers.group, [middleware.auth]);
    usersRoutes(app, controllers.users, [middleware.auth]);
    // classRoutes(app, controllers.class);
    // joinRequestRoutes(app, controllers.joinRequest);
    // questionThreadRoutes(app, controllers.questionThread);
    // messageRoutes(app, controllers.message);
};
