import * as deps from "./dependencies";
import * as QuestionThreadServices from "../../core/services/questionThread";

/**
 * RESTful routing configuration for question-thread-related endpoints.
 * Maps HTTP requests to the QuestionThreadController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /questions/:id - Get specific question
 * - PATCH /questions/:id - Update question
 * - DELETE /questions/:id - Delete question
 * - POST /questions - Create new question
 * - GET /assignments/:idParent/questions - Get all questions in an assignment
 */

/* ************* Extractors ************* */

const extractors = {
    getQuestionThread: undefined, // TODO
    updateQuestionThread: undefined, // TODO
    deleteQuestionThread: undefined, // TODO
    createQuestionThread: undefined, // TODO
    getAssignmentQuestionThreads: undefined, // TODO
};

/* ************* Controller ************* */

export class QuestionThreadController extends deps.Controller {
    constructor(
        get: QuestionThreadServices.GetQuestionThread,
        update: QuestionThreadServices.UpdateQuestionThread,
        remove: QuestionThreadServices.DeleteQuestionThread,
        create: QuestionThreadServices.CreateQuestionThread,
        getAssignmentQuestionThreads: QuestionThreadServices.GetAssignmentQuestionThreads,
    ) {
        super({ get, update, remove, create, getAssignmentQuestionThreads });
    }
}

/* ************* Routes ************* */

export function questionThreadRoutes(
    app: deps.Express,
    controller: QuestionThreadController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/questions/:id",
                controller,
                extractor: extractors.getQuestionThread,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/questions/:id",
                controller,
                extractor: extractors.updateQuestionThread,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/questions/:id",
                controller,
                extractor: extractors.deleteQuestionThread,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/questions",
                controller,
                extractor: extractors.createQuestionThread,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/assignments/:idParent/questions",
                controller,
                extractor: extractors.getAssignmentQuestionThreads,
                handler: (req, data) =>
                    controller.getChildren(req, data, controller.services.getAssignmentQuestionThreads),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
