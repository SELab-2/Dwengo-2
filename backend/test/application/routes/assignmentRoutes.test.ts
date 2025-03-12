import { mockApp, MockAssignmentRepository } from './mocks';
import { assignmentRoutes } from '../../../src/application/routes';
import { AssignmentController } from '../../../src/application/controllers/assignmentController';
import * as AssignmentServices from '../../../src/core/services/assignment/index';
import { IAssignmentRepository } from '../../../src/core/repositories/assignmentRepositoryInterface';
import { DataSource } from 'typeorm';

jest.mock(
  "../../../src/infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM",
  () => ({
    DatasourceFactoryTypeORM: jest.fn().mockImplementation(() => ({
      createDataSource: jest.fn(),
    })),
  })
);

// mock the services used by the controller
class MockGetAssignmentService extends AssignmentServices.GetAssignment {
  constructor(assignmentRepository: MockAssignmentRepository){
    super(assignmentRepository);
  }
  public execute = jest.fn();
}

class MockGetGroupAssignmentsService extends AssignmentServices.GetUserAssignments {
  constructor(assignmentRepository: MockAssignmentRepository){
    super(assignmentRepository);
  }
  public execute = jest.fn();
}

class MockUpdateAssignmentService extends AssignmentServices.UpdateAssignment {
  constructor(assignmentRepository: MockAssignmentRepository){
    super(assignmentRepository);
  }
  public execute = jest.fn();
}

class MockDeleteAssignmentService extends AssignmentServices.DeleteAssignment {
  constructor(assignmentRepository: MockAssignmentRepository){
    super(assignmentRepository);
  }
  public execute = jest.fn();
}

class MockCreateAssignmentService extends AssignmentServices.CreateAssignment {
  constructor(assignmentRepository: MockAssignmentRepository){
    super(assignmentRepository);
  }
  public execute = jest.fn();
}

// mock the controller
class MockAssignmentController extends AssignmentController {
  constructor() {
    super(
      new MockGetAssignmentService(new MockAssignmentRepository()),
      new MockGetGroupAssignmentsService(new MockAssignmentRepository()),
      new MockUpdateAssignmentService(new MockAssignmentRepository()),
      new MockDeleteAssignmentService(new MockAssignmentRepository()),
      new MockCreateAssignmentService(new MockAssignmentRepository())
    );
  }

  public handle = jest.fn();
}

// testing itself
describe("assignmentRoutes", () => {
  it("should define the assignment routes", () => {
    const controller = new MockAssignmentController();
    assignmentRoutes(mockApp, controller);

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
