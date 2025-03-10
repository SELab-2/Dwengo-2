import { Service } from "./service";
import * as QuestionThreadUseCases from "../../core/use-cases/question_thread";

/**
 * Retrieve a question by its id. Also includes the assignment id.
 */
export class GetQuestionService extends Service {
  constructor(get: QuestionThreadUseCases.GetQuestionThread) { super({ get }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Retrieve all questions for an assignment.
 */
export class GetAssignmentQuestionsService extends Service {
  constructor(get: QuestionThreadUseCases.GetAssignmentQuestionThreads) { super({ get }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Update a question by its id.
 */
export class UpdateQuestionService extends Service {
  constructor(update: QuestionThreadUseCases.UpdateQuestionThread) { super({ update }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Delete a question by its id.
 */
export class DeleteQuestionService extends Service {
  constructor(remove: QuestionThreadUseCases.DeleteQuestionThread) { super({ remove }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Create a new question for an assignment.
 */
export class CreateQuestionService extends Service {
  constructor(create: QuestionThreadUseCases.CreateQuestionThread) { super({ create }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}
