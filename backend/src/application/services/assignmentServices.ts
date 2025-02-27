import { Service } from './service';
import { GetAssignment } from '../../core/use-cases/assignment/getAssignment';
import { GetGroupAssignments } from '../../core/use-cases/assignment/getGroupAssignment';
import { UpdateAssignment } from '../../core/use-cases/assignment/updateAssignment';
import { DeleteAssignment } from '../../core/use-cases/assignment/deleteAssignment';
import { CreateAssignment } from '../../core/use-cases/assignment/makeAssignment';
import { Assignment } from '../../core/entities/assignment';
import { UUID } from 'crypto';

/**
 * AssignmentServices organizes assignment-related operations as a collection of specialized Service classes.
 * Each nested class implements a single operation following the Single Responsibility Principle.
 *
 * The static nested class approach provides strong typing and well-defined interfaces
 * while maintaining logical grouping of related services.
 */
export abstract class AssignmentServices {
  public static Get = class extends Service<Assignment> {
    constructor(get: GetAssignment) { super({ get }); }
    execute(assignmentId: UUID) { return this.usecases.get.execute(assignmentId); }
  };

  public static GroupGet = class extends Service<Assignment[]> {
    constructor(get: GetGroupAssignments) { super({ get }); }
    execute(groupId: UUID, page: number, size: number) { return this.usecases.get.execute(groupId, page, size); }
  };

  public static Update = class extends Service<Assignment> {
    constructor(update: UpdateAssignment) { super({ update }); }
    execute(assignmentId: UUID, data: object) { return this.usecases.update.execute(assignmentId, data); }
  };

  public static Delete = class extends Service<Assignment[]> {
    constructor(remove: DeleteAssignment) { super({ remove }); }
    execute(assignmentId: UUID) { return this.usecases.remove.execute(assignmentId); }
  };

  public static Create = class extends Service<Assignment> {
    constructor(create: CreateAssignment) { super({ create }); }
    execute(data: object) { return this.usecases.create.execute(data); }
  };
}