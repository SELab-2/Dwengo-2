import { Service } from './service';
import { GetGroup } from '../../core/use-cases/group/getGroup';
import { GetUserGroups } from '../../core/use-cases/group/getUserGroup';
import { GetClassGroups } from '../../core/use-cases/group/getClassGroup';
import { UpdateGroup } from '../../core/use-cases/group/updateGroup';
import { DeleteGroup } from '../../core/use-cases/group/deleteGroup';
import { CreateGroup } from '../../core/use-cases/group/createGroup';
import { Group } from '../../core/entities/group';
import { UUID } from 'crypto';

/**
 * Collection of services for group-related operations.
 * Provides specialized service classes for retrieving, creating, updating and deleting groups.
 * Each service encapsulates a single use case following the Single Responsibility Principle.
 */

/**
 * Service for retrieving a single group by ID
 */
export class GetGroupService extends Service<Group> {
  constructor(get: GetGroup) { super({ get }); }
  execute(groupId: UUID) { return this.usecases.get.execute(groupId); }
}

/**
 * Service for retrieving groups belonging to a user with pagination
 */
export class GetUserGroupsService extends Service<Group[]> {
  constructor(get: GetUserGroups) { super({ get }); }
  execute(userId: UUID, page: number, size: number) {
    return this.usecases.get.execute(userId, page, size);
  }
}

/**
 * Service for retrieving groups belonging to a class with pagination
 */
export class GetClassGroupsService extends Service<Group[]> {
  constructor(get: GetClassGroups) { super({ get }); }
  execute(classId: UUID, page: number, size: number) {
    return this.usecases.get.execute(classId, page, size);
  }
}

/**
 * Service for updating a group
 */
export class UpdateGroupService extends Service<Group> {
  constructor(update: UpdateGroup) { super({ update }); }
  execute(groupId: UUID, data: object) { return this.usecases.update.execute(groupId, data); }
}

/**
 * Service for deleting a group
 */
export class DeleteGroupService extends Service<Group[]> {
  constructor(remove: DeleteGroup) { super({ remove }); }
  execute(groupId: UUID) { return this.usecases.remove.execute(groupId); }
}

/**
 * Service for creating a new group
 */
export class CreateGroupService extends Service<Group> {
  constructor(create: CreateGroup) { super({ create }); }
  execute(data: object) { return this.usecases.create.execute(data); }
}