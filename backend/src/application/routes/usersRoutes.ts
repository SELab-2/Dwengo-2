import { Express } from 'express';
import { configureRoutes, DEFAULT_METHOD_MAP } from './routes';
import { UsersController } from '../controllers/usersController';
import { HttpMethod } from '../types';

/**
 * RESTful routing configuration for common user-related endpoints.
 * Maps HTTP requests to the provided controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /classes/:idParent/users - Get all users in a class
 * - GET /groups/:idParent/users - Get all users in a group
 * - POST /groups/:idParent/users - Assign user to group
 * - GET /assignments/:idParent/users - Get all users in an assignment
 * - POST /assignments/:idParent/users - Assign user to an assignment
 * - GET /users - Get all users
 * - POST /users - Create new user
 */
export function usersRoutes(app: Express, controller: UsersController): void {
  configureRoutes([
    { app, method: HttpMethod.GET,  urlPattern: '/classes/:idParent/users', controller },
    { app, method: HttpMethod.GET,  urlPattern: '/groups/:idParent/users', controller },
    { app, method: HttpMethod.POST, urlPattern: '/groups/:idParent/users', controller },
    { app, method: HttpMethod.GET,  urlPattern: '/assignments/:idParent/users', controller },
    { app, method: HttpMethod.POST, urlPattern: '/assignments/:idParent/users', controller },
    { app, method: HttpMethod.GET,  urlPattern: '/users', controller },
    { app, method: HttpMethod.POST, urlPattern: '/users', controller },
  ], DEFAULT_METHOD_MAP);
}
