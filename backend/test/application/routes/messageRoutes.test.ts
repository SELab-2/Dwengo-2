import { mockApp, MockMessageRepository, MockQuestionThreadRepository } from "./mocks";
import { messageRoutes } from "../../../src/application/routes/messageRoutes";
import { MessageController } from "../../../src/application/controllers";
import * as MessageServices from "../../../src/core/services/message/index";
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
class MockGetMessageService extends MessageServices.GetMessage {
  public execute = jest.fn();
}

class MockGetThreadMessagesService extends MessageServices.GetThreadMessages {
  public execute = jest.fn();
}

class MockUpdateMessageService extends MessageServices.UpdateMessage {
  public execute = jest.fn();
}

class MockDeleteMessageService extends MessageServices.DeleteMessage {
  public execute = jest.fn();
}

class MockCreateMessageService extends MessageServices.CreateMessage {
  public execute = jest.fn();
}

// mock the controller
class MockMessageController extends MessageController {
  constructor() {
    super(
      new MockGetMessageService(new MockMessageRepository),
      new MockGetThreadMessagesService(new MockQuestionThreadRepository, new MockMessageRepository),
      new MockUpdateMessageService(new MockMessageRepository),
      new MockDeleteMessageService(new MockMessageRepository),
      new MockCreateMessageService(new MockMessageRepository)
    );
  }

  public handle = jest.fn();
}

// testing itself
describe("messageRoutes", () => {
  it("should define the message routes", () => {
    const controller = new MockMessageController();
    messageRoutes(mockApp, controller);

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
