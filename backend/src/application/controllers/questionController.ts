import { Controller } from './controllerExpress';

/**
 * Controller for question routes.
 * 
 * Supported endpoints:
 * - GET /assignments/:idParent/questions/:id - Get question by id
 * - PATCH /assignments/:idParent/questions/:id - Update question by id
 * - DELETE /assignments/:idParent/questions/:id - Delete question by id
 * - GET /assignments/:idParent/questions - Get all questions for an assignment
 * - POST /assignments/:idParent/questions - Create a new question for an assignment
 */
export class QuestionController extends Controller {}
