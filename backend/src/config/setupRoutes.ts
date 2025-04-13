import { Express } from "express";
import { middleware } from "./middleware";
import { controllers } from "../config/controllers";
// eslint-disable-next-line import/order
import * as Resources from "../application/resources";

/**
 * Setup all routes for the Dwengo-2 backend application
 * @param app Express instance
 */
export const setupRoutes = (app: Express) => {
    Resources.assignmentRoutes(app, controllers.assignment, [middleware.auth]);
    Resources.authenticationRoutes(app, controllers.authentication);
    Resources.classRoutes(app, controllers.class, [middleware.auth]);
    Resources.groupRoutes(app, controllers.group, [middleware.auth]);
    Resources.JoinCodeRoutes(app, controllers.joinCode, [middleware.auth]);
    Resources.joinRequestRoutes(app, controllers.joinRequest, [middleware.auth]);
    Resources.messageRoutes(app, controllers.message, [middleware.auth]);
    Resources.questionThreadRoutes(app, controllers.questionThread, [middleware.auth]);
    Resources.submissionRoutes(app, controllers.submission, [middleware.auth]);
    Resources.userRoutes(app, controllers.user, [middleware.auth]);
};
