/**
 * RESTful routing configuration for student-specific endpoints.
 * Maps HTTP requests to the StudentController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - DELETE /classes/:idParent/users/:id - Remove user from class
 * - DELETE /groups/:idParent/users/:id - Remove user from group
 * - GET /users/:id - Get specific user
 * - PATCH /users/:id - Update user
 * - DELETE /users/:id - Delete user
 */

/*
export function studentRoutes(app: Express, controller: StudentController): void {
  configureRoutes([
    { app, method: HttpMethod.DELETE, urlPattern: '/classes/:idParent/users/:id(s-.*)', controller },
    { app, method: HttpMethod.DELETE, urlPattern: '/groups/:idParent/users/:id(s-.*)', controller },
    { app, method: HttpMethod.GET,    urlPattern: '/users/:id(s-.*)', controller },
    { app, method: HttpMethod.PATCH,  urlPattern: '/users/:id(s-.*)', controller },
    { app, method: HttpMethod.DELETE, urlPattern: '/users/:id(s-.*)', controller },
  ], DEFAULT_METHOD_MAP);
}
*/