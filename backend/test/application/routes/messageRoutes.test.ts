import { mockApp } from "./mocks";
import { messageRoutes } from "../../../src/application/routes/messageRoutes";
import { MessageController } from "../../../src/application/controllers";
import * as MessageServices from "../../../src/application/services";
import * as MessageUseCases from "../../../src/core/services/message";

// mock the services used by the controller
class MockGetMessageService extends MessageServices.GetMessageService {
  constructor() { super({} as unknown as MessageUseCases.GetMessage); }
  public execute = jest.fn();
}

class MockGetQuestionMessagesService extends MessageServices.GetQuestionMessagesService {
  constructor() { super({} as unknown as MessageUseCases.GetQuestionMessages); }
  public execute = jest.fn();
}

class MockUpdateMessageService extends MessageServices.UpdateMessageService {
  constructor() { super({} as unknown as MessageUseCases.UpdateMessage); }
  public execute = jest.fn();
}

class MockDeleteMessageService extends MessageServices.DeleteMessageService {
  constructor() { super({} as unknown as MessageUseCases.DeleteMessage); }
  public execute = jest.fn();
}

class MockCreateMessageService extends MessageServices.CreateMessageService {
  constructor() { super({} as unknown as MessageUseCases.CreateMessage); }
  public execute = jest.fn();
}

// mock the controller
class MockMessageController extends MessageController {
  constructor() {
    super(
      new MockGetMessageService(),
      new MockGetQuestionMessagesService(),
      new MockUpdateMessageService(),
      new MockDeleteMessageService(),
      new MockCreateMessageService()
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
});
