import * as deps from "./dependencies";
import * as ClassServices from "../../core/services/class";
import * as ClassSchemas from "../schemas/classSchemas";

/**
 * RESTful routing configuration for class-related endpoints.
 * Maps HTTP requests to the ClassController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /classes/:id - Get class by ID
 * - PATCH /classes/:id - Update class data
 * - DELETE /classes/:id - Delete class
 * - POST /classes - Create a new class
 * - GET /users/:idParent/classes - Get classes for a user
 */

/* ************* Extractors ************* */

const extractors = {
    getClass: deps.createZodParamsExtractor(ClassSchemas.getClassSchema),
    updateClass: deps.createZodParamsExtractor(ClassSchemas.updateClassSchema),
    deleteClass: deps.createZodParamsExtractor(ClassSchemas.deleteClassSchema),
    createClass: deps.createZodParamsExtractor(ClassSchemas.createClassSchema),
    getUserClasses: deps.createZodParamsExtractor(ClassSchemas.getUserClassesSchema),
};

/* ************* Controller ************* */

export class ClassController extends deps.Controller {
    constructor(
        get: ClassServices.GetClass,
        update: ClassServices.UpdateClass,
        remove: ClassServices.DeleteClass,
        create: ClassServices.CreateClass,
        getUserClasses: ClassServices.GetUserClasses,
    ) {
        super({ get, update, remove, create, getUserClasses });
    }
}

/* ************* Routes ************* */

export function classRoutes(
    app: deps.Express,
    controller: ClassController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/classes/:id",
                controller,
                extractor: extractors.getClass,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/classes/:id",
                controller,
                extractor: extractors.updateClass,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/classes/:id",
                controller,
                extractor: extractors.deleteClass,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/classes",
                controller,
                extractor: extractors.createClass,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/users/:idParent/classes",
                controller,
                extractor: extractors.getUserClasses,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getUserClasses),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
