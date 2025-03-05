import { Service } from './service';
import { Assignment } from '../../core/entities/assignment';
import { GetAssignment } from '../../core/use-cases/assignment/getAssignment';
import { MakeAssignment } from '../../core/use-cases/assignment/makeAssignment';

export class GetAssignmentService extends Service<Assignment> {
  constructor(get: GetAssignment) { super({ get }); }
  // TODO: implement the execute function
}

export class GetGroupAssignmentsService extends Service<Assignment[]> {
  // TODO: implement constructor with GetGroupAssignments use case
  // TODO: implement the execute function
}

export class UpdateAssignmentService extends Service<Assignment> {
  // TODO: implement constructor with UpdateAssignment use case
  // TODO: implement the execute function
}

export class DeleteAssignmentService extends Service<void> {
  // TODO: implement constructor with DeleteAssignment use case
  // TODO: implement the execute function
}

export class CreateAssignmentService extends Service<Assignment> {
  constructor(create: MakeAssignment) { super({ create }); }
  // TODO: implement the execute function
}
