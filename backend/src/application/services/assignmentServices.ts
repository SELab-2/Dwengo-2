import { Service } from './service';
import { GetAssignment } from '../../core/use-cases/assignment/getAssignment';
import { GetGroupAssignments } from '../../core/use-cases/assignment/getGroupAssignment';
import { UpdateAssignment } from '../../core/use-cases/assignment/updateAssignment';
import { DeleteAssignment } from '../../core/use-cases/assignment/deleteAssignment';
import { CreateAssignment } from '../../core/use-cases/assignment/makeAssignment';
import { Assignment } from '../../core/entities/assignment';
import { UUID } from 'crypto';

export class Get extends Service<Assignment> {
  constructor(get: GetAssignment) { super({ get }); }
  execute(assignmentId: UUID) { return this.usecases.get.execute(assignmentId); }
}

export class GroupGet extends Service<Assignment[]> {
  constructor(get: GetGroupAssignments) { super({ get }); }
  execute(groupId: UUID, page: number, size: number) { return this.usecases.get.execute(groupId, page, size); }
}

export class Update extends Service<Assignment> {
  constructor(update: UpdateAssignment) { super({ update }); }
  execute(assignmentId: UUID, data: object) { return this.usecases.update.execute(assignmentId, data); }
}

export class Delete extends Service<Assignment[]> {
  constructor(remove: DeleteAssignment) { super({ remove }); }
  execute(assignmentId: UUID) { return this.usecases.remove.execute(assignmentId); }
}

export class Create extends Service<Assignment> {
  constructor(create: CreateAssignment) { super({ create }); }
  execute(data: object) { return this.usecases.create.execute(data); }
}
