import * as deps from "./dependencies";
import * as MessageServices from "../../core/services/message";
import * as MessageSchemas from "../schemas/messageSchemas";

/**
 * RESTful routing configuration for message-related endpoints.
 * Maps HTTP requests to the MessageController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - GET /messages/:id - Get specific message
 * - PATCH /messages/:id - Update message
 * - DELETE /messages/:id - Delete message
 * - POST /messages - Create new message
 * - GET /questions/:idParent/messages - Get all messages in a question thread
 */

/* ************* Extractors ************* */

const extractors = {
    getMessage: deps.createZodParamsExtractor(MessageSchemas.getMessageSchema),
    updateMessage: deps.createZodParamsExtractor(MessageSchemas.updateMessageSchema),
    deleteMessage: deps.createZodParamsExtractor(MessageSchemas.deleteMessageSchema),
    createMessage: deps.createZodParamsExtractor(MessageSchemas.createMessageSchema),
    getThreadMessages: deps.createZodParamsExtractor(MessageSchemas.getThreadMessagesSchema),
};

/* ************* Controller ************* */

export class MessageController extends deps.Controller {
    constructor(
        get: MessageServices.GetMessage,
        update: MessageServices.UpdateMessage,
        remove: MessageServices.DeleteMessage,
        create: MessageServices.CreateMessage,
        getThreadMessages: MessageServices.GetThreadMessages,
    ) {
        super({ get, update, remove, create, getThreadMessages });
    }
}

/* ************* Routes ************* */

export function messageRoutes(
    app: deps.Express,
    controller: MessageController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/messages/:id",
                controller,
                extractor: extractors.getMessage,
                handler: (req, data) => controller.getOne(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.PATCH,
                urlPattern: "/messages/:id",
                controller,
                extractor: extractors.updateMessage,
                handler: (req, data) => controller.update(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.DELETE,
                urlPattern: "/messages/:id",
                controller,
                extractor: extractors.deleteMessage,
                handler: (req, data) => controller.delete(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/messages",
                controller,
                extractor: extractors.createMessage,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
            {
                app,
                method: deps.HttpMethod.GET,
                urlPattern: "/questions/:idParent/messages",
                controller,
                extractor: extractors.getThreadMessages,
                handler: (req, data) => controller.getChildren(req, data, controller.services.getThreadMessages),
                middleware,
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
