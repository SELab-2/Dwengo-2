import { Service } from './service';
import { User } from '../../core/entities/user';

/**
 * TODO - Maybe in the controller reroute to student or teacher services instead based
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
  // TODO: implement constructor with GetAllUsers use case
  // TODO: implement the execute function
}

/**
 * Service for creating a new user
 */
export class CreateUserService extends Service<User> {
  // TODO: implement constructor with CreateUser use case
  // TODO: implement the execute function
}

/**
 * Service for retrieving all users in a class with pagination
 */
export class GetClassUsersService extends Service<User[]> {
  // TODO: implement constructor with GetClassUsers use case
  // TODO: implement the execute function
}

/**
 * Service for retrieving all users in a group with pagination
 */
export class GetGroupUsersService extends Service<User[]> {
  // TODO: implement constructor with GetGroupUsers use case
  // TODO: implement the execute function
}

/**
 * Service for assigning a user to a group
 */
export class AssignUserToGroupService extends Service<User> {
  // TODO: implement constructor with AssignUserToGroup use case
  // TODO: implement the execute function
}

/**
 * Service for retrieving all users in an assignment with pagination
 */
export class GetAssignmentUsersService extends Service<User[]> {
  // TODO: implement constructor with GetAssignmentUsers use case
  // TODO: implement the execute function
}

/**
 * Service for assigning a user to an assignment
 */
export class AssignUserToAssignmentService extends Service<User> {
  // TODO: implement constructor with AssignUserToAssignment use case
  // TODO: implement the execute function
}