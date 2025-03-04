import { Service } from './service';
import { Teacher } from '../../core/entities/teacher';
import { UUID } from 'crypto';

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
  execute(teacherId: UUID) { return this.usecases.get.execute(teacherId); }
}

/**
 * Service for updating a teacher
 */
export class UpdateTeacherService extends Service<Teacher> {
  constructor(update: UpdateTeacher) { super({ update }); }
  execute(teacherId: UUID, data: object) { return this.usecases.update.execute(teacherId, data); }
}

/**
 * Service for deleting a teacher
 */
export class DeleteTeacherService extends Service<void> {
  constructor(remove: DeleteTeacher) { super({ remove }); }
  execute(teacherId: UUID) { return this.usecases.remove.execute(teacherId); }
}

/**
 * Service for removing a teacher from a class
 */
export class RemoveTeacherFromClassService extends Service<void> {
  constructor(classRemove: RemoveTeacherFromClass) { super({ classRemove }); }
  execute(teacherId: UUID, classId: UUID) { return this.usecases.classRemove.execute(teacherId, classId); }
}
