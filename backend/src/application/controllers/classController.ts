import { Controller } from "./controllerExpress";
import { ServiceParams } from "../../config/service";
import * as ClassServices from "../../core/services/class";
import { createParamsExtractor } from "../extractors";
import { HttpMethod, Request, RouteHandlers } from "../types";

const extractors = {
    getClass: createParamsExtractor(ClassServices.GetClassParams, { _id: "idParent", _classId: "id" }, {}, [
        "_className",
    ]),
    getUserClasses: createParamsExtractor(ClassServices.GetClassParams, { _id: "idParent" }, {}, [
        "_className",
        "_classId",
    ]),
    updateClass: createParamsExtractor(
        ClassServices.UpdateClassParams,
        { _id: "id", _name: "name", _description: "description", _targetAudience: "audience" },
        {},
        [],
    ),
    deleteClass: createParamsExtractor(ClassServices.DeleteClassParams, { _id: "id" }, {}, []),
    createClass: createParamsExtractor(
        ClassServices.CreateClassParams,
        { _name: "name", _description: "description", _targetAudience: "audience", _teacherId: "teacher" },
        {},
        [],
    ),
};

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
        get: ClassServices.GetClassByClassId,
        getUserClasses: ClassServices.GetUserClasses,
        update: ClassServices.UpdateClass,
        remove: ClassServices.DeleteClass,
        create: ClassServices.CreateClass,
    ) {
        const handlers: RouteHandlers = {
            [HttpMethod.GET]: [
                {
                    parent: "users",
                    hasId: true,
                    hasParentId: true,
                    extractor: extractors.getClass,
                    handler: (req: Request, data: ServiceParams) => this.getOne(req, data),
                },
                {
                    parent: "users",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.getUserClasses,
                    handler: (req: Request, data: ClassServices.GetClassParams) =>
                        this.getChildren(req, data, getUserClasses),
                },
            ],
            [HttpMethod.PATCH]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.updateClass,
                    handler: (req: Request, data: ServiceParams) => this.update(req, data),
                },
            ],
            [HttpMethod.POST]: [
                {
                    hasId: false,
                    hasParentId: false,
                    extractor: extractors.createClass,
                    handler: (req: Request, data: ServiceParams) => this.create(req, data),
                },
            ],
            [HttpMethod.DELETE]: [
                {
                    hasId: true,
                    hasParentId: false,
                    extractor: extractors.deleteClass,
                    handler: (req: Request, data: ServiceParams) => this.delete(req, data),
                },
            ],
        };

        super({ get, getUserClasses, update, remove, create }, handlers);
    }
}
