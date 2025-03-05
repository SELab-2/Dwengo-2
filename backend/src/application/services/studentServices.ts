import { Service } from './service';
import { Student } from '../../core/entities/student';
import { GetStudent } from '../../core/use-cases/student/getStudent';
import { DeleteStudent } from '../../core/use-cases/student/deleteStudent';
import { UpdateStudent } from '../../core/use-cases/student/updateStudent';
import { RemoveStudentFromClass } from '../../core/use-cases/student/removeStudentFromClass';
import { RemoveStudentFromGroup } from '../../core/use-cases/student/removeStudentFromGroup';

/**
 * Collection of services for student-related operations.
 * Provides specialized service classes for retrieving, updating, and deleting students,
 * as well as managing their class and group memberships.
 * Each service encapsulates a single use case following the Single Responsibility Principle.
 */

/**
 * Service for retrieving a single student by ID
 */
export class GetStudentService extends Service<Student> {
  constructor(get: GetStudent) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Service for updating a student
 */
export class UpdateStudentService extends Service<Student> {
  constructor(update: UpdateStudent) { super({ update }); }
  // TODO: implement the execute function
}

/**
 * Service for deleting a student
 */
export class DeleteStudentService extends Service<void> {
  constructor(remove: DeleteStudent) { super({ remove }); }
  // TODO: implement the execute function
}

/**
 * Service for removing a student from a class
 */
export class RemoveStudentFromClassService extends Service<void> {
  // TODO: implement constructor with RemoveStudentFromClass use case
  // TODO: implement the execute function
}

/**
 * Service for removing a student from a group
 */
export class RemoveStudentFromGroupService extends Service<void> {
  // TODO: implement constructor with RemoveStudentFromGroup use case
  // TODO: implement the execute function
}