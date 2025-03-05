import { Controller } from './controllerExpress';

/**
 * Controller responsible for pending invite-related API endpoints including CRUD operations
 * and invite listings by user. Follows RESTful patterns with paths:
 * Supported endpoints:
 * - GET /users/:idParent/invites/:id - Get specific invite for a user
 * - GET /users/:idParent/invites - Get all pending invites for a user
 * - DELETE /invites/:id - Delete invite
 * - POST /invites - Create new invite
 */
export class PendingInviteController extends Controller {}
