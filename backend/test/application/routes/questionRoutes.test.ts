import { mockApp, MockQuestionThreadRepository } from "./mocks";
import { questionThreadRoutes } from "../../../src/application/routes";
import { QuestionController } from "../../../src/application/controllers/questionController";
import * as QuestionServices from "../../../src/core/services/question_thread/index";
import { DataSource } from "typeorm";

jest.mock(
  "../../../src/infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM",
  () => ({
    DatasourceFactoryTypeORM: jest.fn().mockImplementation(() => ({
      createDataSource: jest.fn(),
    })),
  })
);

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
      new MockGetQuestionService(new MockQuestionThreadRepository),
      new MockGetAssignmentQuestionsService(new MockQuestionThreadRepository),
      new MockUpdateQuestionService(new MockQuestionThreadRepository),
      new MockDeleteQuestionService(new MockQuestionThreadRepository),
      new MockCreateQuestionService(new MockQuestionThreadRepository)
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

  afterAll(() => {
    jest.clearAllMocks();
  });
});
