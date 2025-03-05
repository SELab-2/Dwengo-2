import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import * as QuestionServices from '../services/questionServices';

/**
 * Controller for question routes.
 * 
 * Supported endpoints:
 * - GET    /assignments/:idParent/questions/:id - Get question by id
 * - GET    /assignments/:idParent/questions - Get all questions for an assignment
 * - PATCH  /assignments/:idParent/questions/:id - Update question by id
 * - DELETE /assignments/:idParent/questions/:id - Delete question by id
 * - POST   /assignments/:idParent/questions - Create a new question for an assignment
 */
export class QuestionController extends Controller {
  constructor(
    get: QuestionServices.GetQuestionService,
    getAssignmentQuestions: QuestionServices.GetAssignmentQuestionsService,
    update: QuestionServices.UpdateQuestionService,
    remove: QuestionServices.DeleteQuestionService,
    create: QuestionServices.CreateQuestionService
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: 'assignments', hasId: true, hasParentId: true, handler: (req: Request) => this.getOne(req) },
        { parent: 'assignments', hasId: false, hasParentId: true, handler: (req: Request) => this.getMany(req) },
      ],
      [HttpMethod.PATCH]: [
        { parent: 'assignments', hasId: true, hasParentId: true, handler: (req: Request) => this.update(req) },
      ],
      [HttpMethod.DELETE]: [
        { parent: 'assignments', hasId: true, hasParentId: true, handler: (req: Request) => this.delete(req) },
      ],
      [HttpMethod.POST]: [
        { parent: 'assignments', hasId: false, hasParentId: true, handler: (req: Request) => this.create(req) },
      ],
    };

    super({ get, getAssignmentQuestions, update, remove, create }, handlers);
  }
}
