import { Service } from "./service";
import * as PendingInviteUseCases from '../../core/use-cases/pending_invite';

/**
 * Service responsible for getting a specific pending invite by ID
 */
export class GetPendingInviteService extends Service {
  constructor(get: PendingInviteUseCases.GetInvite) { super({ get }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Service responsible for getting all pending invites for a user
 */
export class GetUserPendingInvitesService extends Service {
  constructor(get: PendingInviteUseCases.GetUserInvites) { super({ get }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Service responsible for deleting a pending invite
 */
export class DeletePendingInviteService extends Service {
  constructor(remove: PendingInviteUseCases.DeleteInvite) { super({ remove }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Service responsible for creating a new pending invite
 */
export class CreatePendingInviteService extends Service {
  constructor(create: PendingInviteUseCases.CreateInvite) { super({ create }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}
