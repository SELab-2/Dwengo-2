import { mockApp } from './mocks';
import { assignmentRoutes } from '../../../src/application/routes';
import { AssignmentController } from '../../../src/application/controllers/assignmentController';
import * as AssignmentServices from '../../../src/application/services/assignmentServices';
import * as AssignmentUseCases from '../../../src/core/use-cases/assignment';

// mock the services used by the controller
class MockGetAssignmentService extends AssignmentServices.GetAssignmentService {
  constructor() { super({} as unknown as AssignmentUseCases.GetAssignment); }
  public execute = jest.fn();
}

class MockGetGroupAssignmentsService extends AssignmentServices.GetGroupAssignmentsService {
  constructor() { super({} as unknown as AssignmentUseCases.GetGroupAssignment); }
  public execute = jest.fn();
}

class MockUpdateAssignmentService extends AssignmentServices.UpdateAssignmentService {
  constructor() { super({} as unknown as AssignmentUseCases.UpdateAssignment); }
  public execute = jest.fn();
}

class MockDeleteAssignmentService extends AssignmentServices.DeleteAssignmentService {
  constructor() { super({} as unknown as AssignmentUseCases.DeleteAssignment); }
  public execute = jest.fn();
}

class MockCreateAssignmentService extends AssignmentServices.CreateAssignmentService {
  constructor() { super({} as unknown as AssignmentUseCases.CreateAssignment); }
  public execute = jest.fn();
}

// mock the controller
class MockAssignmentController extends AssignmentController {
  constructor() {
    super(
      new MockGetAssignmentService(),
      new MockGetGroupAssignmentsService(),
      new MockUpdateAssignmentService(),
      new MockDeleteAssignmentService(),
      new MockCreateAssignmentService()
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
});
