import { Controller } from "./controllerExpress";

/**
 * Controller responsible for class-related API endpoints including CRUD operations
 * and class listings by group. Follows RESTful patterns with paths:
 * - GET /users/:idParent/classes/:id - Get user's class by ID
 * - GET /users/:idParent/classes - Get classes for a user
 * - PATCH /classes/:id - Update class data
 * - DELETE /classes/:id - Delete class
 * - POST /classes - Create a new class
 */
export class ClassController extends Controller {}
