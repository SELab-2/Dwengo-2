import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import { defaultExtractor } from './helpersExpress';
import * as MessageServices from '../../core/services/message';


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
    getQuestionMessages: MessageServices.GetThreadMessages,
    update: MessageServices.UpdateMessage,
    remove: MessageServices.DeleteMessage,
    create: MessageServices.CreateMessage
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: 'questions', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getOne(req, data) },
        { parent: 'questions', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req, data, getQuestionMessages) },
      ],
      [HttpMethod.PATCH]: [
        { parent: 'questions', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.update(req, data) },
      ],
      [HttpMethod.DELETE]: [
        { parent: 'questions', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.delete(req, data) },
      ],
      [HttpMethod.POST]: [
        { parent: 'questions', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.create(req, data) },
      ],
    };

    super({ get, getQuestionMessages, update, remove, create }, handlers);
  }
}
