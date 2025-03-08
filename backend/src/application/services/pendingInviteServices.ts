import { Service } from "./service";
import { PendingInvite } from "../../core/entities/pendingInvite";
import { GetInvite } from "../../core/use-cases/pending_invite/getInvite";
import { DeleteInvite } from "../../core/use-cases/pending_invite/deleteInvite";
import { CreateInvite } from "../../core/use-cases/pending_invite/createInvite";
import { GetUserInvite } from "../../core/use-cases/pending_invite/getUserInvite";

/**
 * Service responsible for getting a specific pending invite by ID
 */
export class GetPendingInviteService extends Service {
  constructor(get: GetInvite) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Service responsible for getting all pending invites for a user
 */
export class GetUserPendingInvitesService extends Service {
  // TODO: implement constructor with GetUserInvite use case
  // TODO: implement the execute function
}

/**
 * Service responsible for deleting a pending invite
 */
export class DeletePendingInviteService extends Service {
  constructor(remove: DeleteInvite) { super({ remove }); }
  // TODO: implement the execute function
}

/**
 * Service responsible for creating a new pending invite
 */
export class CreatePendingInviteService extends Service {
  constructor(create: CreateInvite) { super({ create }); }
  // TODO: implement the execute function
}
