import { Controller } from './controllerExpress';

/**
 * Controller for group routes.
 * 
 * Supported endpoints:
 * - GET /users/:idParent/groups/:id - Get group by id
 * - GET /users/:idParent/groups - Get all groups for a user
 * - GET /classes/:idParent/groups/:id - Get group by id
 * - GET /classes/:idParent/groups - Get all groups for a class
 * - PATCH /groups/:id - Update group by id
 * - DELETE /groups/:id - Delete group by id
 * - POST /groups - Create a new group
 */
export class GroupController extends Controller {}
