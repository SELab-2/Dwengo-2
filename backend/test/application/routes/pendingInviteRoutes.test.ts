import { mockApp } from "./mocks";
import { pendingInviteRoutes } from "../../../src/application/routes";
import { PendingInviteController } from "../../../src/application/controllers/pendingInviteController";
import * as PendingInviteServices from "../../../src/core/services/pending_invite/index";
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
class MockGetPendingInviteService extends PendingInviteServices.GetInvite {
  public execute = jest.fn();
}

class MockGetUserPendingInvitesService extends PendingInviteServices.GetUserInvites {
  public execute = jest.fn();
}

class MockDeletePendingInviteService extends PendingInviteServices.DeleteInvite {
  public execute = jest.fn();
}

class MockCreatePendingInviteService extends PendingInviteServices.CreateInvite {
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

  afterAll(() => {
    jest.clearAllMocks();
  });
});
