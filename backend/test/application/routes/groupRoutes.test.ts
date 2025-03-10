import { mockApp } from "./mocks";
import { groupRoutes } from "../../../src/application/routes";
import { GroupController } from "../../../src/application/controllers/groupController";
import * as GroupServices from "../../../src/application/services/groupServices";
import * as GroupUseCases from "../../../src/core/services/group";

// mock the services used by the controller
class MockGetGroupService extends GroupServices.GetGroupService {
  constructor() { super({} as unknown as GroupUseCases.GetGroup); }
  public execute = jest.fn();
}

class MockGetUserGroupsService extends GroupServices.GetUserGroupsService {
  constructor() { super({} as unknown as GroupUseCases.GetUserGroups); }
  public execute = jest.fn();
}

class MockGetClassGroupsService extends GroupServices.GetClassGroupsService {
  constructor() { super({} as unknown as GroupUseCases.GetClassGroups); }
  public execute = jest.fn();
}

class MockUpdateGroupService extends GroupServices.UpdateGroupService {
  constructor() { super({} as unknown as GroupUseCases.UpdateGroup); }
  public execute = jest.fn();
}

class MockDeleteGroupService extends GroupServices.DeleteGroupService {
  constructor() { super({} as unknown as GroupUseCases.DeleteGroup); }
  public execute = jest.fn();
}

class MockCreateGroupService extends GroupServices.CreateGroupService {
  constructor() { super({} as unknown as GroupUseCases.CreateGroup); }
  public execute = jest.fn();
}

// mock the controller
class MockGroupController extends GroupController {
  constructor() {
    super(
      new MockGetGroupService(),
      new MockGetUserGroupsService(),
      new MockGetClassGroupsService(),
      new MockUpdateGroupService(),
      new MockDeleteGroupService(),
      new MockCreateGroupService()
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
});
