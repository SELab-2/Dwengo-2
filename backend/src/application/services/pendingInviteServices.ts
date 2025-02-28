import { Service } from './service';
import { UUID } from 'crypto';

// TODO: add other imports for usecases

export class Get extends Service<PendingInvite> {
  constructor(get: GetPendingInvite) { super({ get }); }
  execute(pendingInviteId: UUID) { return this.usecases.get.execute(pendingInviteId); }
}

export class UserGet extends Service<PendingInvite[]> {
  constructor(get: GetUserPendingInvites) { super({ get }); }
  execute(userId: UUID, page: number, size: number) { return this.usecases.get.execute(userId, page, size); }
}

export class Delete extends Service<PendingInvite[]> {
  constructor(remove: DeletePendingInvite) { super({ remove }); }
  execute(pendingInviteId: UUID) { return this.usecases.remove.execute(pendingInviteId); }
}

export class Create extends Service<PendingInvite> {
  constructor(create: CreatePendingInvite) { super({ create }); }
  execute(data: object) { return this.usecases.create.execute(data); }
}
