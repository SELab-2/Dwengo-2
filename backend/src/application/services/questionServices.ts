import { Service } from "./service";
import { Question } from "../../core/entities/question";
import { GetQuestion } from "../../core/use-cases/question/getQuestion";
import { UpdateQuestion } from "../../core/use-cases/question/updateQuestion";
import { DeleteQuestion } from "../../core/use-cases/question/deleteQuestion";
import { CreateQuestion } from "../../core/use-cases/question/createQuestion";
import { GetAssignmentQuestions } from "../../core/use-cases/question/getQuestions";

/**
 * Retrieve a question by its id. Also includes the assignment id.
 */
export class GetQuestionService extends Service {
  constructor(get: GetQuestion) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Retrieve all questions for an assignment.
 */
export class GetAssignmentQuestionsService extends Service {
  // TODO: implement constructor with GetAssignmentQuestions use case
  // TODO: implement the execute function
}

/**
 * Update a question by its id.
 */
export class UpdateQuestionService extends Service {
  constructor(update: UpdateQuestion) { super({ update }); }
  // TODO: implement the execute function
}

/**
 * Delete a question by its id.
 */
export class DeleteQuestionService extends Service {
  constructor(remove: DeleteQuestion) { super({ remove }); }
  // TODO: implement the execute function
}

/**
 * Create a new question for an assignment.
 */
export class CreateQuestionService extends Service {
  constructor(create: CreateQuestion) { super({ create }); }
  // TODO: implement the execute function
}
