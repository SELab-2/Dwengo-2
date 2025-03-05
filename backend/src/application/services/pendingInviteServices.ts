import { Service } from "./service";
import { PendingInvite } from "../../core/entities/pendingInvite";
import { GetInvite } from "../../core/use-cases/pending_invite/getInvite";
import { GetUserInvite } from "../../core/use-cases/pending_invite/getUserInvite";
import { DeleteInvite } from "../../core/use-cases/pending_invite/deleteInvite";
import { CreateInvite } from "../../core/use-cases/pending_invite/createInvite";

export class Get extends Service<PendingInvite> {
  constructor(get: GetInvite) { super({ get }); }
  // TODO: implement the execute function
}

export class UserGet extends Service<PendingInvite> {
  constructor(userGet: GetUserInvite) { super({ userGet }); }
  // TODO: implement the execute function
}

export class Delete extends Service<PendingInvite> {
  constructor(remove: DeleteInvite) { super({ remove }); }
  // TODO: implement the execute function
}

export class Create extends Service<PendingInvite> {
  constructor(create: CreateInvite) { super({ create }); }
  // TODO: implement the execute function
}
