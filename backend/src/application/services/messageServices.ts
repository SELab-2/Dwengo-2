import { Service } from "./service";
import { Message } from "../../core/entities/message";
import { GetMessage } from "../../core/use-cases/message/getMessage";
import { CreateMessage } from "../../core/use-cases/message/createMessage";
import { DeleteMessage } from "../../core/use-cases/message/deleteMessage";
import { GetQuestionMessages } from "../../core/use-cases/message/getQuestionMessages";

export class GetMessageService extends Service<Message> {
  constructor(get: GetMessage) { super({ get }); }
  // TODO: implement the execute function
}

export class GetQuestionMessagesService extends Service<Message[]> {
  constructor(questionGet: GetQuestionMessages) { super({ questionGet }); }
  // TODO: implement the execute function
}

export class UpdateMessageService extends Service<Message> {
  // TODO: implement constructor with UpdateMessage use case
  // TODO: implement the execute function
}

export class DeleteMessageService extends Service<void> {
  constructor(remove: DeleteMessage) { super({ remove }); }
  // TODO: implement the execute function
}

export class CreateMessageService extends Service<Message> {
  constructor(create: CreateMessage) { super({ create }); }
  // TODO: implement the execute function
}
