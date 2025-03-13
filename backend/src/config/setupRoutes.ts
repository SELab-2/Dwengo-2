import { Express } from 'express'
import { controllers } from "../config/controllers";
import { 
  assignmentRoutes, 
  groupRoutes, 
  classRoutes, 
  joinRequestRoutes, 
  messageRoutes, 
  questionThreadRoutes, 
  usersRoutes, 
  authenticationRoutes 
} from "../application/routes";

/**
 * Setup all routes for the Dwengo-2 backend application
 * @param app Express instance
 */
export const setupRoutes = (app: Express) => {
  usersRoutes(app, controllers.users);
  classRoutes(app, controllers.class);
  groupRoutes(app, controllers.group);
  assignmentRoutes(app, controllers.assignment);
  joinRequestRoutes(app, controllers.joinRequest);
  questionThreadRoutes(app, controllers.questionThread);
  messageRoutes(app, controllers.message);
  authenticationRoutes(app, controllers.authentication);
};
