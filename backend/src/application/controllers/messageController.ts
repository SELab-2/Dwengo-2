import { Controller } from './controller';
import { Request, HttpMethod, RouteHandlers } from '../types';
import { Get, QuestionGet, Update, Delete, Create } from '../services/messageServices';

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
  public constructor(
    get: Get,
    questionGet: QuestionGet,
    update: Update,
    remove: Delete,
    create: Create
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { hasId: true, hasParentId: true, handler: (req: Request) => this.getOne(req) },
        { hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) }
      ],
      [HttpMethod.PATCH]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.update(req) }
      ],
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, handler: (req: Request) => this.create(req) }
      ],
      [HttpMethod.DELETE]: [
        { hasId: true, hasParentId: false, handler: (req: Request) => this.delete(req) }
      ]
    };

    super({ get, questionGet, update, remove, create }, handlers);
  }
}
