import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import * as MessageServices from '../services/messageServices';

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
    get: MessageServices.Get,
    questionGet: MessageServices.GetQuestionMessages,
    update: MessageServices.Update,
    remove: MessageServices.Delete,
    create: MessageServices.Create
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: 'questions', hasId: true, hasParentId: true, handler: (req: Request) => this.getOne(req) },
        { parent: 'questions', hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) },
      ],
      [HttpMethod.PATCH]: [
        { parent: 'questions', hasId: true, hasParentId: true, handler: (req: Request) => this.update(req) },
      ],
      [HttpMethod.DELETE]: [
        { parent: 'questions', hasId: true, hasParentId: true, handler: (req: Request) => this.delete(req) },
      ],
      [HttpMethod.POST]: [
        { parent: 'questions', hasId: false, hasParentId: true, handler: (req: Request) => this.create(req) },
      ],
    };

    super({ get, questionGet, update, remove, create }, handlers);
  }
}
