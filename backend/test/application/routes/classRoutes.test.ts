import { mockApp } from './mocks';
import { classRoutes } from '../../../src/application/routes';
import { ClassController } from '../../../src/application/controllers';
import * as ClassServices from '../../../src/application/services';
import * as ClassUseCases from '../../../src/core/services/class';

// mock the services used by the controller
class MockGetClassService extends ClassServices.GetClassService {
  constructor() { super({} as unknown as ClassUseCases.GetClass); }
  public execute = jest.fn();
}

class MockGetUserClassesService extends ClassServices.GetUserClassesService {
  constructor() { super({} as unknown as ClassUseCases.GetUserClasses); }
  public execute = jest.fn();
}

class MockUpdateClassService extends ClassServices.UpdateClassService {
  constructor() { super({} as unknown as ClassUseCases.UpdateClass); }
  public execute = jest.fn();
}

class MockDeleteClassService extends ClassServices.DeleteClassService {
  constructor() { super({} as unknown as ClassUseCases.DeleteClass); }
  public execute = jest.fn();
}

class MockCreateClassService extends ClassServices.CreateClassService {
  constructor() { super({} as unknown as ClassUseCases.CreateClass); }
  public execute = jest.fn();
}

// mock the controller
class MockClassController extends ClassController {
  constructor() {
    super(
      new MockGetClassService(),
      new MockGetUserClassesService(),
      new MockUpdateClassService(),
      new MockDeleteClassService(),
      new MockCreateClassService()
    );
  }

  public handle = jest.fn();
}

// testing itself
describe("classRoutes", () => {
  it("should define the class routes", () => {
    const controller = new MockClassController();
    classRoutes(mockApp, controller);

    expect(mockApp.get).toHaveBeenCalledTimes(2);
    expect(mockApp.patch).toHaveBeenCalledTimes(1);
    expect(mockApp.delete).toHaveBeenCalledTimes(1);
    expect(mockApp.post).toHaveBeenCalledTimes(1);

    expect(controller.handle).not.toHaveBeenCalled();
  });
});
