import * as deps from "./dependencies";
import * as TaskServices from "../../core/services/task";
import * as TaskSchemas from "../schemas/taskSchemas";

/**
 * RESTful routing configuration for task-related endpoints.
 * Maps HTTP requests to the provided controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /users/:idParent/task - Get the task of all assignments of a user.
 * - GET /assignments/:idParent/task - Get the task of all users in an assignment
 * - GET /groups/:idParent/task - Get the task of all users in a group
 * - GET /users/:userId/assignment/:assignmentId/task - Get the task of a user for a specific assignment
 * - GET /classes/:idParent/completion - Shows how much of the assignments for a class have been completed (on average)
 * - GET /classes/:idParent/activity - Get an array with the amount of submissions for a class in the last 12 months (array of zero to twelve numbers)
 */

/* ************* Extractors ************* */

const extractors = {
    createTask: deps.createZodParamsExtractor(TaskSchemas.createTaskSchema),
    getTask: deps.createZodParamsExtractor(TaskSchemas.getTaskSchema),
    getTasks: deps.createZodParamsExtractor(TaskSchemas.getTasksSchema),
    deleteTask: deps.createZodParamsExtractor(TaskSchemas.deleteTaskSchema)
};

/* ************* Controller ************* */

export class TaskController extends deps.Controller {
    constructor(
        createTask: TaskServices.CreateTask,
        getTask: TaskServices.GetTask,
        getTasks: TaskServices.GetTasks,
        deleteTask: TaskServices.DeleteTask
    ) {
        super({
            createTask,
            getTask,
            getTasks,
            deleteTask
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
                urlPattern: "/assignments/:idParent/tasks",
                controller,
                extractor: extractors.createTask,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "task/:id",
                controller,
                extractor: extractors.getTask,
                handler: (req, data) => controller.getOne(req, data)
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "task/:id",
                controller,
                extractor: extractors.getTask,
                handler: (req, data) => controller.delete(req, data)
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignments/:idParent/tasks",
                controller,
                extractor: extractors.getTasks,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getTasks)
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
