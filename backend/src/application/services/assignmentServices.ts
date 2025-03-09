import { Service } from './service';
import * as AssignmentUseCases from '../../core/use-cases/assignment';

/**
 * Responsible for retrieving a single assignment by ID
 */
export class GetAssignmentService extends Service {
  constructor(get: AssignmentUseCases.GetAssignment) { super({ get }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Responsible for retrieving all assignments for a group by group ID
 */
export class GetGroupAssignmentsService extends Service {
  constructor(getGroup: AssignmentUseCases.GetGroupAssignment) { super({ getGroup }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Updates an assignment, identified by ID, with new data
 */
export class UpdateAssignmentService extends Service {
  constructor(update: AssignmentUseCases.UpdateAssignment) { super({ update }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Deletes an assignment by ID
 */
export class DeleteAssignmentService extends Service {
  constructor(remove: AssignmentUseCases.DeleteAssignment) { super({ remove }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}

/**
 * Creates a new assignment
 */
export class CreateAssignmentService extends Service {
  constructor(create: AssignmentUseCases.CreateAssignment) { super({ create }); }
  // TODO: implement the execute function
  public execute() {
    return {

    }
  }
}
