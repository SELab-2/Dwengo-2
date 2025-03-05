import { Service } from "./service";
import { Question } from "../../core/entities/question";
import { GetQuestion } from "../../core/use-cases/question/getQuestion";
import { UpdateQuestion } from "../../core/use-cases/question/updateQuestion";
import { DeleteQuestion } from "../../core/use-cases/question/deleteQuestion";
import { CreateQuestion } from "../../core/use-cases/question/createQuestion";
import { GetAssignmentQuestions } from "../../core/use-cases/question/getQuestions";

export class GetQuestionService extends Service<Question> {
  constructor(get: GetQuestion) { super({ get }); }
  // TODO: implement the execute function
}

export class GetAssignmentQuestionsService extends Service<Question[]> {
  // TODO: implement constructor with GetAssignmentQuestions use case
  // TODO: implement the execute function
}

export class UpdateQuestionService extends Service<Question> {
  constructor(update: UpdateQuestion) { super({ update }); }
  // TODO: implement the execute function
}

export class DeleteQuestionService extends Service<void> {
  constructor(remove: DeleteQuestion) { super({ remove }); }
  // TODO: implement the execute function
}

export class CreateQuestionService extends Service<Question> {
  constructor(create: CreateQuestion) { super({ create }); }
  // TODO: implement the execute function
}
