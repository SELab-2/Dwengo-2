import { Service } from "./service"; 
import { Message } from "../../core/entities/message";
import { GetMessage } from "../../core/use-cases/message/getMessage";
import { SetupMessage } from "../../core/use-cases/message/setupMessage";
import { UpdateMessage } from "../../core/use-cases/message/updateMessage";
import { DeleteMessage } from "../../core/use-cases/message/deleteMessage";
import { GetQuestionMessages } from "../../core/use-cases/message/getQuestionMessages";

export class Get extends Service<Message> {
  constructor(get: GetMessage) { super({ get }); }
  // TODO: implement the execute function
}

export class GetQuestionMessages extends Service<Message> {
  constructor(questionGet: GetQuestionMessage) { super({ questionGet }); }
  // TODO: implement the execute function
}

export class Update extends Service<Message> {
  constructor(update: UpdateMessage) { super({ update }); }
  // TODO: implement the execute function
}

export class Delete extends Service<Message> {
  constructor(remove: DeleteMessage) { super({ remove }); }
  // TODO: implement the execute function
}

export class Create extends Service<Message> {
  constructor(create: SetupMessage) { super({ create }); }
  // TODO: implement the execute function
}
