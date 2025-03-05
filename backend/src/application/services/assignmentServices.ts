import { Service } from './service';
import { Assignment } from '../../core/entities/assignment';
import { GetAssignment } from '../../core/use-cases/assignment/getAssignment';
import { CreateAssignment } from '../../core/use-cases/assignment/makeAssignment';
import { DeleteAssignment } from '../../core/use-cases/assignment/deleteAssignment';
import { UpdateAssignment } from '../../core/use-cases/assignment/updateAssignment';
import { GetGroupAssignments } from '../../core/use-cases/assignment/getGroupAssignments';

/**
 * Responsible for retrieving a single assignment by ID 
 */
export class GetAssignmentService extends Service<Assignment> {
  constructor(get: GetAssignment) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Responsible for retrieving all assignments for a group by group ID
 */
export class GetGroupAssignmentsService extends Service<Assignment[]> {
  // TODO: implement constructor with GetGroupAssignments use case
  // TODO: implement the execute function
}

/**
 * Updates an assignment, identified by ID, with new data
 */
export class UpdateAssignmentService extends Service<Assignment> {
  // TODO: implement constructor with UpdateAssignment use case
  // TODO: implement the execute function
}

/**
 * Deletes an assignment by ID
 */
export class DeleteAssignmentService extends Service<void> {
  // TODO: implement constructor with DeleteAssignment use case
  // TODO: implement the execute function
}

/**
 * Creates a new assignment
 */
export class CreateAssignmentService extends Service<Assignment> {
  constructor(create: MakeAssignment) { super({ create }); }
  // TODO: implement the execute function
}

/**
 * Deletes an assignment by ID
 */
export class DeleteAssignmentService extends Service<void> {
  constructor(remove: DeleteAssignment) { super({ remove }); }
  // TODO: implement the execute function
}
