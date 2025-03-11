import { mockApp, MockClassRepository } from './mocks';
import { classRoutes } from '../../../src/application/routes';
import { ClassController } from '../../../src/application/controllers';
import * as ClassServices from '../../../src/core/services/class/index';

jest.mock(
  "../../../src/infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM",
  () => ({
    DatasourceFactoryTypeORM: jest.fn().mockImplementation(() => ({
      createDataSource: jest.fn(),
    })),
  })
);

// Mock class services
class MockGetClassService extends ClassServices.GetClassByClassId {
  constructor(classRepository: MockClassRepository) {
    super(classRepository);
  }
  public execute = jest.fn();
}

class MockGetUserClassesService extends ClassServices.GetUserClasses {
  public execute = jest.fn();
}

class MockUpdateClassService extends ClassServices.UpdateClass {
  public execute = jest.fn();
}

class MockDeleteClassService extends ClassServices.DeleteClass {
  public execute = jest.fn();
}

class MockCreateClassService extends ClassServices.CreateClass {
  public execute = jest.fn();
}

// Mock the controller
class MockClassController extends ClassController {
  constructor() {
    super(
      new MockGetClassService(new MockClassRepository()),
      new MockGetUserClassesService(new MockClassRepository()),
      new MockUpdateClassService(new MockClassRepository()),
      new MockDeleteClassService(new MockClassRepository()),
      new MockCreateClassService(new MockClassRepository())
    );
  }

  public handle = jest.fn();
}

// Test
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

  afterAll(() => {
    jest.clearAllMocks();
  });
});