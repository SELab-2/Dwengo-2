import { Service } from './service';
import { Student } from '../../core/entities/student';
import { UUID } from 'crypto';

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
  execute(studentId: UUID) { return this.usecases.get.execute(studentId); }
}

/**
 * Service for updating a student
 */
export class UpdateStudentService extends Service<Student> {
  constructor(update: UpdateStudent) { super({ update }); }
  execute(studentId: UUID, data: object) { return this.usecases.update.execute(studentId, data); }
}

/**
 * Service for deleting a student
 */
export class DeleteStudentService extends Service<void> {
  constructor(remove: DeleteStudent) { super({ remove }); }
  execute(studentId: UUID) { return this.usecases.remove.execute(studentId); }
}

/**
 * Service for removing a student from a class
 */
export class RemoveStudentFromClassService extends Service<void> {
  constructor(classRemove: RemoveStudentFromClass) { super({ classRemove }); }
  execute(studentId: UUID, classId: UUID) { return this.usecases.classRemove.execute(studentId, classId); }
}

/**
 * Service for removing a student from a group
 */
export class RemoveStudentFromGroupService extends Service<void> {
  constructor(groupRemove: RemoveStudentFromGroup) { super({ groupRemove }); }
  execute(studentId: UUID, groupId: UUID) { return this.usecases.groupRemove.execute(studentId, groupId); }
}