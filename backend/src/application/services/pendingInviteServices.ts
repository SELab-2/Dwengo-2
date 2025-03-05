import { Service } from "./service";
import { PendingInvite } from "../../core/entities/pendingInvite";
import { GetInvite } from "../../core/use-cases/pending_invite/getInvite";
import { DeleteInvite } from "../../core/use-cases/pending_invite/deleteInvite";
import { CreateInvite } from "../../core/use-cases/pending_invite/createInvite";

export class GetPendingInviteService extends Service<PendingInvite> {
  constructor(get: GetInvite) { super({ get }); }
  // TODO: implement the execute function
}

export class GetUserPendingInvitesService extends Service<PendingInvite[]> {
  // TODO: implement constructor with GetUserInvite use case
  // TODO: implement the execute function
}

export class DeletePendingInviteService extends Service<void> {
  constructor(remove: DeleteInvite) { super({ remove }); }
  // TODO: implement the execute function
}

export class CreatePendingInviteService extends Service<PendingInvite> {
  constructor(create: CreateInvite) { super({ create }); }
  // TODO: implement the execute function
}
