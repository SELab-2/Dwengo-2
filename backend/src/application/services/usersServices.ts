import { Service } from './service';
import { User } from '../../core/entities/user';
import { UUID } from 'crypto';

/**
 * TODO - Maybe in the controlle reroute to student or teacher services instead based
 * on type and remove these services, probably a better approach.
 */

/**
 * Collection of services for general user management operations.
 * Provides specialized service classes for retrieving, creating, and assigning users.
 * Each service encapsulates a single use case following the Single Responsibility Principle.
 */

/**
 * Service for retrieving all users with pagination
 */
export class GetAllUsersService extends Service<User[]> {
  constructor(getAll: GetAllUsers) { super({ getAll }); }
  execute(page: number, size: number) { return this.usecases.getAll.execute(page, size); }
}

/**
 * Service for creating a new user
 */
export class CreateUserService extends Service<User> {
  constructor(create: CreateUser) { super({ create }); }
  execute(data: object) { return this.usecases.create.execute(data); }
}

/**
 * Service for retrieving all users in a class with pagination
 */
export class GetClassUsersService extends Service<User[]> {
  constructor(getClassUsers: GetClassUsers) { super({ getClassUsers }); }
  execute(classId: UUID, page: number, size: number) {
    return this.usecases.getClassUsers.execute(classId, page, size);
  }
}

/**
 * Service for retrieving all users in a group with pagination
 */
export class GetGroupUsersService extends Service<User[]> {
  constructor(getGroupUsers: GetGroupUsers) { super({ getGroupUsers }); }
  execute(groupId: UUID, page: number, size: number) {
    return this.usecases.getGroupUsers.execute(groupId, page, size);
  }
}

/**
 * Service for assigning a user to a group
 */
export class AssignUserToGroupService extends Service<User> {
  constructor(assignToGroup: AssignUserToGroup) { super({ assignToGroup }); }
  execute(groupId: UUID, userData: object) {
    return this.usecases.assignToGroup.execute(groupId, userData);
  }
}

/**
 * Service for retrieving all users in an assignment with pagination
 */
export class GetAssignmentUsersService extends Service<User[]> {
  constructor(getAssignmentUsers: GetAssignmentUsers) { super({ getAssignmentUsers }); }
  execute(assignmentId: UUID, page: number, size: number) {
    return this.usecases.getAssignmentUsers.execute(assignmentId, page, size);
  }
}

/**
 * Service for assigning a user to an assignment
 */
export class AssignUserToAssignmentService extends Service<User> {
  constructor(assignToAssignment: AssignUserToAssignment) { super({ assignToAssignment }); }
  execute(assignmentId: UUID, userData: object) {
    return this.usecases.assignToAssignment.execute(assignmentId, userData);
  }
}