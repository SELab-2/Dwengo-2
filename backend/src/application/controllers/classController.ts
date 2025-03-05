import { Controller } from "./controllerExpress";
import { Request, HttpMethod, RouteHandlers } from "../types";
import * as ClassServices from "../services/classServices";

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
    get: ClassServices.GetClassService,
    userGet: ClassServices.GetUserClassesService,
    update: ClassServices.UpdateClassService,
    remove: ClassServices.DeleteClassService,
    create: ClassServices.CreateClassService
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: "users", hasId: true, hasParentId: true, handler: (req: Request) => this.getOne(req) },
        { parent: "users", hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) },
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.update(req) },
      ],
      [HttpMethod.POST]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) },
      ],
      [HttpMethod.DELETE]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) },
      ],
    };

    super({ get, userGet, update, remove, create }, handlers);
  }
}
