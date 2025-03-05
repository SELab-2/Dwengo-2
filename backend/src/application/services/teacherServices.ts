import { Service } from './service';
import { Teacher } from '../../core/entities/teacher';
import { GetTeacher } from '../../core/use-cases/teacher/getTeacher';
import { UpdateTeacher } from '../../core/use-cases/teacher/updateTeacher';
import { DeleteTeacher } from '../../core/use-cases/teacher/deleteTeacher';
import { RemoveTeacherFromClass } from '../../core/use-cases/teacher/removeTeacherFromClass';

/**
 * Collection of services for teacher-related operations.
 * Provides specialized service classes for retrieving, updating, and deleting teachers.
 * Each service encapsulates a single use case following the Single Responsibility Principle.
 */

/**
 * Service for retrieving a single teacher by ID
 */
export class GetTeacherService extends Service<Teacher> {
  constructor(get: GetTeacher) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Service for updating a teacher
 */
export class UpdateTeacherService extends Service<Teacher> {
  constructor(update: UpdateTeacher) { super({ update }); }
  // TODO: implement the execute function
}

/**
 * Service for deleting a teacher
 */
export class DeleteTeacherService extends Service<void> {
  constructor(remove: DeleteTeacher) { super({ remove }); }
  // TODO: implement the execute function
}

/**
 * Service for removing a teacher from a class
 */
export class RemoveTeacherFromClassService extends Service<void> {
  // TODO: implement constructor with RemoveTeacherFromClassService use case
  // TODO: implement the execute function
}
