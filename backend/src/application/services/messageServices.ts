import { Service } from "./service";
import { Message } from "../../core/entities/message";
import { GetMessage } from "../../core/use-cases/message/getMessage";
import { CreateMessage } from "../../core/use-cases/message/createMessage";
import { UpdateMessage } from "../../core/use-cases/message/updateMessage";
import { DeleteMessage } from "../../core/use-cases/message/deleteMessage";
import { GetQuestionMessages } from "../../core/use-cases/message/getQuestionMessages";

/**
 * Retrieves a single message by ID
 */
export class GetMessageService extends Service<Message> {
  constructor(get: GetMessage) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Retrieves all messages for a question
 */
export class GetQuestionMessagesService extends Service<Message[]> {
  constructor(questionGet: GetQuestionMessages) { super({ questionGet }); }
  // TODO: implement the execute function
}

/**
 * Updates a message
 */
export class UpdateMessageService extends Service<Message> {
  // TODO: implement constructor with UpdateMessage use case
  // TODO: implement the execute function
}

/**
 * Deletes a message
 */
export class DeleteMessageService extends Service<void> {
  constructor(remove: DeleteMessage) { super({ remove }); }
  // TODO: implement the execute function
}

/**
 * Creates a new message
 */
export class CreateMessageService extends Service<Message> {
  constructor(create: CreateMessage) { super({ create }); }
  // TODO: implement the execute function
}
