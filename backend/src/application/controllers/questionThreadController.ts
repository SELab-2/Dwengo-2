import { Controller } from './controllerExpress';
import { Request, HttpMethod, RouteHandlers } from '../types';
import * as QuestionThreadServices from '../../core/services/questionThread';
import { createParamsExtractor } from '../extractors';
import { ServiceParams } from '../../config/service';

const extractors = {
  get: createParamsExtractor(QuestionThreadServices.GetQuestionThreadParams, { '_id': 'id' }, {}, []),
  getAssignmentQuestions: createParamsExtractor(QuestionThreadServices.GetAssignmentQuestionThreadsParams, { '_assignmentId': 'idParent' }, {}, []),
  update: createParamsExtractor(QuestionThreadServices.UpdateQuestionThreadParams, { '_id': 'id' }, {}, ['__isClosed', '_visibility']),
  remove: createParamsExtractor(QuestionThreadServices.DeleteQuestionThreadParams, { '_id': 'id' }, {}, []),
  create: createParamsExtractor(QuestionThreadServices.CreateQuestionThreadParams, { '_assignmentId': 'idParent', '_creatorId': 'creator', 'learningObjectId': 'learningObject', 'isClosed': 'closed', '_visibility': 'visibility', '_messageIds': 'messageIds' }, {}, ['_id']),
}

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

// I don't think this is the right approach for QuestionThread but there wasn't a controller for it, so I'm using this as a template
export class QuestionThreadController extends Controller {
  constructor(
    get: QuestionThreadServices.GetQuestionThread,
    getAssignmentQuestions: QuestionThreadServices.GetAssignmentQuestionThreads,
    update: QuestionThreadServices.UpdateQuestionThread,
    remove: QuestionThreadServices.DeleteQuestionThread,
    create: QuestionThreadServices.CreateQuestionThread
  ) {
    const handlers: RouteHandlers = {
      [HttpMethod.GET]: [
        { parent: 'assignments', hasId: true, hasParentId: true, extractor: extractors.get,
          handler: (req: Request, data: ServiceParams) => this.getOne(req, data) },
        { parent: 'assignments', hasId: false, hasParentId: true, extractor: extractors.getAssignmentQuestions,
          handler: (req: Request, data: QuestionThreadServices.GetAssignmentQuestionThreadsParams) => this.getChildren(req, data, getAssignmentQuestions) },
      ],
      [HttpMethod.PATCH]: [
        { parent: 'assignments', hasId: true, hasParentId: true, extractor: extractors.update,
          handler: (req: Request, data: ServiceParams) => this.update(req, data) },
      ],
      [HttpMethod.DELETE]: [
        { parent: 'assignments', hasId: true, hasParentId: true, extractor: extractors.remove,
          handler: (req: Request, data: ServiceParams) => this.delete(req, data) },
      ],
      [HttpMethod.POST]: [
        { parent: 'assignments', hasId: false, hasParentId: true, extractor: extractors.create,
          handler: (req: Request, data: ServiceParams) => this.create(req, data) },
      ],
    };

    super({ get, getAssignmentQuestions, update, remove, create }, handlers);
  }
}
