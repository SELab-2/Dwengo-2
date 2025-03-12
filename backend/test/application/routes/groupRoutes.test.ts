import { mockApp, MockGroupRepository } from "./mocks";
import { groupRoutes } from "../../../src/application/routes";
import { GroupController } from "../../../src/application/controllers/groupController";
import * as GroupServices from "../../../src/core/services/group/index";

jest.mock(
  "../../../src/infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM",
  () => ({
    DatasourceFactoryTypeORM: jest.fn().mockImplementation(() => ({
      createDataSource: jest.fn(),
    })),
  })
);

// mock the services used by the controller
class MockGetGroupService extends GroupServices.GetGroup {
  public execute = jest.fn();
}

class MockGetUserGroupsService extends GroupServices.GetUserGroups {
  public execute = jest.fn();
}

class MockGetClassGroupsService extends GroupServices.GetClassGroups {
  public execute = jest.fn();
}

class MockUpdateGroupService extends GroupServices.UpdateGroup {
  public execute = jest.fn();
}

class MockDeleteGroupService extends GroupServices.DeleteGroup {
  public execute = jest.fn();
}

class MockCreateGroupService extends GroupServices.CreateGroup {
  public execute = jest.fn();
}

// mock the controller
class MockGroupController extends GroupController {
  constructor() {
    super(
      new MockGetGroupService(new MockGroupRepository()),
      new MockGetUserGroupsService(new MockGroupRepository()),
      new MockGetClassGroupsService(new MockGroupRepository()),
      new MockUpdateGroupService(new MockGroupRepository()),
      new MockDeleteGroupService(new MockGroupRepository()),
      new MockCreateGroupService(new MockGroupRepository())
    );
  }

  public handle = jest.fn();
}

// testing itself
describe("groupRoutes", () => {
  it("should define the group routes", () => {
    const controller = new MockGroupController();
    groupRoutes(mockApp, controller);

    expect(mockApp.get).toHaveBeenCalledTimes(4);
    expect(mockApp.patch).toHaveBeenCalledTimes(1);
    expect(mockApp.delete).toHaveBeenCalledTimes(1);
    expect(mockApp.post).toHaveBeenCalledTimes(1);

    expect(controller.handle).not.toHaveBeenCalled();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
