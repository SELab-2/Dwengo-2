import { Controller } from "./controllerExpress";
import { ServiceParams } from "../../config/service";
import * as MessageServices from "../../core/services/message";
import { createParamsExtractor } from "../extractors";
import { Request, HttpMethod, RouteHandlers } from "../types";

const extractors = {
    get: createParamsExtractor(MessageServices.GetMessageParams, { _id: "id" }, {}, []),
    getThreadMessages: createParamsExtractor(
        MessageServices.GetThreadMessagesParams,
        { _threadId: "idParent" },
        {},
        [],
    ),
    update: createParamsExtractor(MessageServices.UpdateMessageParams, { _id: "id", _content: "content" }, {}, []),
    remove: createParamsExtractor(MessageServices.DeleteMessageParams, { _id: "id" }, {}, []),
    create: createParamsExtractor(
        MessageServices.CreateMessageParams,
        { _sender: "sender", _createdAt: "date", _threadId: "idParent", _content: "content" },
        {},
        [],
    ),
};

/**
 * Controller responsible for message-related API endpoints including CRUD operations
 * and message listings by question. Follows RESTful patterns with paths:
 * Supported endpoints:
 * - GET /questions/:idParent/messages/:id - Get specific message for a question
 * - GET /questions/:idParent/messages - Get all messages for a question
 * - PATCH /questions/:idParent/messages/:id - Update message data
 * - DELETE /questions/:idParent/messages/:id - Delete message
 * - POST /questions/:idParent/messages - Create a new message
 */
export class MessageController extends Controller {
    constructor(
        get: MessageServices.GetMessage,
        getThreadMessages: MessageServices.GetThreadMessages,
        update: MessageServices.UpdateMessage,
        remove: MessageServices.DeleteMessage,
        create: MessageServices.CreateMessage,
    ) {
        const handlers: RouteHandlers = {
            [HttpMethod.GET]: [
                {
                    parent: "questions",
                    hasId: true,
                    hasParentId: true,
                    extractor: extractors.get,
                    handler: (req: Request, data: ServiceParams) => this.getOne(req, data),
                },
                {
                    parent: "questions",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.getThreadMessages,
                    handler: (req: Request, data: MessageServices.GetThreadMessagesParams) =>
                        this.getChildren(req, data, getThreadMessages),
                },
            ],
            [HttpMethod.PATCH]: [
                {
                    parent: "questions",
                    hasId: true,
                    hasParentId: true,
                    extractor: extractors.update,
                    handler: (req: Request, data: ServiceParams) => this.update(req, data),
                },
            ],
            [HttpMethod.DELETE]: [
                {
                    parent: "questions",
                    hasId: true,
                    hasParentId: true,
                    extractor: extractors.remove,
                    handler: (req: Request, data: ServiceParams) => this.delete(req, data),
                },
            ],
            [HttpMethod.POST]: [
                {
                    parent: "questions",
                    hasId: false,
                    hasParentId: true,
                    extractor: extractors.create,
                    handler: (req: Request, data: ServiceParams) => this.create(req, data),
                },
            ],
        };

        super({ get, getThreadMessages, update, remove, create }, handlers);
    }
}
