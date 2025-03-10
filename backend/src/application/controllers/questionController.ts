import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import { defaultExtractor } from './helpersExpress';
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
        { parent: 'assignments', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getOne(req, data) },
        { parent: 'assignments', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.getChildren(req,data, getAssignmentQuestions) },
      ],
      [HttpMethod.PATCH]: [
        { parent: 'assignments', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.update(req, data) },
      ],
      [HttpMethod.DELETE]: [
        { parent: 'assignments', hasId: true, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.delete(req, data) },
      ],
      [HttpMethod.POST]: [
        { parent: 'assignments', hasId: false, hasParentId: true, extractor: defaultExtractor,
          handler: (req: Request, data: object) => this.create(req, data) },
      ],
    };

    super({ get, getAssignmentQuestions, update, remove, create }, handlers);
  }
}
