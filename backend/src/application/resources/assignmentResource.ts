import { Express, RequestHandler } from "express";
import * as AssignmentServices from "../../core/services/assignment";
import { Controller } from "../controllers/controllerExpress";
import { createZodParamsExtractor } from "../extractors";
import { configureRoutes, DEFAULT_METHOD_MAP } from "../routes/routesExpress";
import {
    createAssignmentSchema,
    deleteAssignmentSchema,
    getAssignmentSchema,
    getUserAssignmentsSchema,
    updateAssignmentSchema,
} from "../schemas";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for assignment-related endpoints.
 * Maps HTTP requests to the AssignmentController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /assignments/:id - Get specific assignment
 * - PATCH /assignments/:id - Update assignment
 * - DELETE /assignments/:id - Delete assignment
 * - POST /assignments - Create new assignment
 * - GET /users/:idParent/assignments - Get all assignments of a user
 */

/* ************* Extractors ************* */

const extractors = {
    getAssignment: createZodParamsExtractor(getAssignmentSchema),
    updateAssignment: createZodParamsExtractor(updateAssignmentSchema),
    deleteAssignment: createZodParamsExtractor(deleteAssignmentSchema),
    createAssignment: createZodParamsExtractor(createAssignmentSchema),
    getUserAssignments: createZodParamsExtractor(getUserAssignmentsSchema),
};

/* ************* Controller ************* */

export class AssignmentController extends Controller {
    constructor(
        get: AssignmentServices.GetAssignment,
        update: AssignmentServices.UpdateAssignment,
        remove: AssignmentServices.DeleteAssignment,
        create: AssignmentServices.CreateAssignment,
        getUserAssignments: AssignmentServices.GetUserAssignments,
    ) {
        super({ get, update, remove, create, getUserAssignments });
    }
}

/* ************* Routes ************* */

export function assignmentRoutes(
    app: Express,
    controller: AssignmentController,
    middleware: RequestHandler[] = [],
): void {
    configureRoutes(
        [
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/assignments/:id",
                controller,
                extractor: extractors.getAssignment,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/assignments/:id",
                controller,
                extractor: extractors.updateAssignment,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.DELETE,
                urlPattern: "/assignments/:id",
                controller,
                extractor: extractors.deleteAssignment,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/assignments",
                controller,
                extractor: extractors.createAssignment,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: HttpMethod.GET,
                urlPattern: "/users/:idParent/assignments",
                controller,
                extractor: extractors.getUserAssignments,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getUserAssignments),
                middleware,
            },
        ],
        DEFAULT_METHOD_MAP,
    );
}
