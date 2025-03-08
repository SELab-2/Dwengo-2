import { Controller } from "./controllerExpress";
import { Request, HttpMethod, RouteHandlers } from "../types";
import { defaultExtractor } from "./helpersExpress";
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
    getUserClasses: ClassServices.GetUserClassesService,
    update: ClassServices.UpdateClassService,
    remove: ClassServices.DeleteClassService,
    create: ClassServices.CreateClassService
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: "users", hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getOne(req, data) },
        { parent: "users", hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req, data, getUserClasses) },
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.update(req, data) },
      ],
      [HttpMethod.POST]: [
        { hasId: true, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.delete(req, data) },
      ],
      [HttpMethod.DELETE]: [
        { hasId: false, hasParentId: false, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.create(req, data) },
      ],
    };

    super({ get, getUserClasses, update, remove, create }, handlers);
  }
}
