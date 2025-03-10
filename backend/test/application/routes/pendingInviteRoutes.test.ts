import { mockApp } from "./mocks";
import { pendingInviteRoutes } from "../../../src/application/routes";
import { PendingInviteController } from "../../../src/application/controllers/pendingInviteController";
import * as PendingInviteServices from "../../../src/application/services/pendingInviteServices";
import * as PendingInviteUseCases from "../../../src/core/use-cases/pending_invite";

// mock the services used by the controller
class MockGetPendingInviteService extends PendingInviteServices.GetPendingInviteService {
  constructor() {
    super({} as unknown as PendingInviteUseCases.GetInvite);
  }
  public execute = jest.fn();
}

class MockGetUserPendingInvitesService extends PendingInviteServices.GetUserPendingInvitesService {
  constructor() {
    super({} as unknown as PendingInviteUseCases.GetUserInvites);
  }
  public execute = jest.fn();
}

class MockDeletePendingInviteService extends PendingInviteServices.DeletePendingInviteService {
  constructor() {
    super({} as unknown as PendingInviteUseCases.DeleteInvite);
  }
  public execute = jest.fn();
}

class MockCreatePendingInviteService extends PendingInviteServices.CreatePendingInviteService {
  constructor() {
    super({} as unknown as PendingInviteUseCases.CreateInvite);
  }
  public execute = jest.fn();
}

// mock the controller
class MockPendingInviteController extends PendingInviteController {
  constructor() {
    super(
      new MockGetPendingInviteService(),
      new MockGetUserPendingInvitesService(),
      new MockDeletePendingInviteService(),
      new MockCreatePendingInviteService()
    );
  }

  public handle = jest.fn();
}

// testing itself
describe("pendingInviteRoutes", () => {
  it("should define the pending invite routes", () => {
    const controller = new MockPendingInviteController();
    pendingInviteRoutes(mockApp, controller);

    expect(mockApp.get).toHaveBeenCalledTimes(2);
    expect(mockApp.delete).toHaveBeenCalledTimes(1);
    expect(mockApp.post).toHaveBeenCalledTimes(1);

    expect(controller.handle).not.toHaveBeenCalled();
  });
});
