import { Express } from 'express';
import { configureRoutes, DEFAULT_METHOD_MAP } from './routesExpress';
import { TeacherController } from '../controllers/teacherController';
import { HttpMethod } from '../types';

/**
 * RESTful routing configuration for teacher-specific endpoints.
 * Maps HTTP requests to the TeacherController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - DELETE /classes/:idParent/users/:id - Remove user from class
 * - GET /users/:id - Get specific user
 * - PATCH /users/:id - Update user
 * - DELETE /users/:id - Delete user
 */
export function teacherRoutes(app: Express, controller: TeacherController): void {
  configureRoutes([
    { app, method: HttpMethod.DELETE, urlPattern: '/classes/:idParent/users/:id(t-.*)', controller },
    { app, method: HttpMethod.GET,    urlPattern: '/users/:id(t-.*)', controller },
    { app, method: HttpMethod.PATCH,  urlPattern: '/users/:id(t-.*)', controller },
    { app, method: HttpMethod.DELETE, urlPattern: '/users/:id(t-.*)', controller },
  ], DEFAULT_METHOD_MAP);
}
