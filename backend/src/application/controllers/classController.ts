import { Controller } from "./controller";
import { Request, HttpMethod, RouteHandlers } from "../types";
import { Get, UserGet, Update, Delete, Create } from "../services/classServices";

/**
 * Controller responsible for class-related API endpoints including CRUD operations
 * and class listings by group. Follows RESTful patterns with paths:
 * - GET /users/:idParent/classes/:id - Get user's class by ID
 * - GET /users/:idParent/classes - Get classes for a user
 * - PATCH /classes/:id - Update class data
 * - DELETE /classes/:id - Delete class
 * - POST /classes - Create a new class
 */
export class ClassController extends Controller {
  constructor(
    get: Get,
    userGet: UserGet,
    update: Update,
    remove: Delete,
    create: Create
  ) {
    const handlers : RouteHandlers = {
      // pattern matching for each HTTP method
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: true, handler: (req: Request) => this.getOne(req) },
        { hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.update(req) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) }
      ]
    };

    super({ get, userGet, update, remove, create }, handlers);
  }
}
