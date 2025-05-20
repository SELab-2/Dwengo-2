import * as deps from "./dependencies";
import * as TaskServices from "../../core/services/task";
import * as TaskSchemas from "../schemas/taskSchemas";

/**
 * RESTful routing configuration for task-related endpoints.
 * Maps HTTP requests to the provided controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /tasks/:id - Get a task with id
 * - PATCH /tasks/:id - Update a task with id
 * - DELETE /tasks/:id - Delete a task with id
 * - POST /tasks - Create a task
 * - GET /assignments/:idParent/tasks?step=number - Get all tasks of an assignment (with optional step selection)
 */

/* ************* Extractors ************* */

const extractors = {
    createTask: deps.createZodParamsExtractor(TaskSchemas.createTaskSchema),
    updateTask: deps.createZodParamsExtractor(TaskSchemas.updateTaskSchema),
    getTask: deps.createZodParamsExtractor(TaskSchemas.getTaskSchema),
    getTasks: deps.createZodParamsExtractor(TaskSchemas.getTasksSchema),
    deleteTask: deps.createZodParamsExtractor(TaskSchemas.deleteTaskSchema),
};

/* ************* Controller ************* */

export class TaskController extends deps.Controller {
    constructor(
        get: TaskServices.GetTask,
        update: TaskServices.UpdateTask,
        remove: TaskServices.DeleteTask,
        create: TaskServices.CreateTask,
        getTasks: TaskServices.GetTasks,
    ) {
        super({
            get,
            update,
            remove,
            create,
            getTasks,
        });
    }
}

/* ************* Routes ************* */

export function taskRoutes(
    app: deps.Express,
    controller: TaskController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/tasks",
                controller,
                extractor: extractors.createTask,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/tasks/:id",
                controller,
                extractor: extractors.updateTask,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/tasks/:id",
                controller,
                extractor: extractors.getTask,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/tasks/:id",
                controller,
                extractor: extractors.getTask,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignments/:idParent/tasks",
                controller,
                extractor: extractors.getTasks,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getTasks),
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
