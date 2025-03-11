import { mockApp } from "./mocks";
import { questionThreadRoutes } from "../../../src/application/routes";
import { QuestionController } from "../../../src/application/controllers/questionController";
import * as QuestionServices from "../../../src/core/services/question_thread/index";

// mock the services used by the controller
class MockGetQuestionService extends QuestionServices.GetQuestionThread {
  public execute = jest.fn();
}

class MockGetAssignmentQuestionsService extends QuestionServices.GetAssignmentQuestionThreads {
  public execute = jest.fn();
}

class MockUpdateQuestionService extends QuestionServices.UpdateQuestionThread {
  public execute = jest.fn();
}

class MockDeleteQuestionService extends QuestionServices.DeleteQuestionThread {
  public execute = jest.fn();
}

class MockCreateQuestionService extends QuestionServices.CreateQuestionThread {
  public execute = jest.fn();
}

// mock the controller
class MockQuestionController extends QuestionController {
  constructor() {
    super(
      new MockGetQuestionService(),
      new MockGetAssignmentQuestionsService(),
      new MockUpdateQuestionService(),
      new MockDeleteQuestionService(),
      new MockCreateQuestionService()
    );
  }

  public handle = jest.fn();
}

// testing itself
describe("questionThreadRoutes", () => {
  it("should define the question routes", () => {
    const controller = new MockQuestionController();
    questionThreadRoutes(mockApp, controller);

    expect(mockApp.get).toHaveBeenCalledTimes(2);
    expect(mockApp.patch).toHaveBeenCalledTimes(1);
    expect(mockApp.delete).toHaveBeenCalledTimes(1);
    expect(mockApp.post).toHaveBeenCalledTimes(1);

    expect(controller.handle).not.toHaveBeenCalled();
  });
});
