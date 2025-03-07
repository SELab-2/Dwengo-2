import { Service } from './service';
import { Group } from '../../core/entities/group';
import { GetGroup } from '../../core/use-cases/group/getGroup';
import { GetUserGroups } from '../../core/use-cases/group/getUserGroups';
import { GetClassGroups } from '../../core/use-cases/group/getClassGroups';
import { UpdateGroup } from '../../core/use-cases/group/updateGroup';
import { DeleteGroup } from '../../core/use-cases/group/deleteGroup';
import { CreateGroup } from '../../core/use-cases/group/createGroup';

/**
 * Collection of services for group-related operations.
 * Provides specialized service classes for retrieving, creating, updating and deleting groups.
 * Each service encapsulates a single use case following the Single Responsibility Principle.
 */

/**
 * Service for retrieving a single group by ID
 */
export class GetGroupService extends Service {
  constructor(get: GetGroup) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Service for retrieving groups belonging to a user with pagination
 */
export class GetUserGroupsService extends Service {
  // TODO: implement constructor with GetUserGroups use case
  // TODO: implement the execute function
}

/**
 * Service for retrieving groups belonging to a class with pagination
 */
export class GetClassGroupsService extends Service {
  // TODO: implement constructor with GetClassGroups use case
  // TODO: implement the execute function
}

/**
 * Service for updating a group
 */
export class UpdateGroupService extends Service {
  // TODO: implement constructor with UpdateGroup use case
  // TODO: implement the execute function
}

/**
 * Service for deleting a group
 */
export class DeleteGroupService extends Service {
  constructor(remove: DeleteGroup) { super({ remove }); }
  // TODO: implement the execute function
}

/**
 * Service for creating a new group
 */
export class CreateGroupService extends Service {
  constructor(create: CreateGroup) { super({ create }); }
  // TODO: implement the execute function
}
