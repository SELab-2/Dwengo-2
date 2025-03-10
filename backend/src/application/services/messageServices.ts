import { Service } from "./service";
import * as MessageUseCases from "../../core/use-cases/message";

/**
 * Retrieves a single message by ID
 */
export class GetMessageService extends Service {
  constructor(get: MessageUseCases.GetMessage) { super({ get }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Retrieves all messages for a question
 */
export class GetQuestionMessagesService extends Service {
  constructor(questionGet: MessageUseCases.GetQuestionMessages) { super({ questionGet }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Updates a message
 */
export class UpdateMessageService extends Service {
  constructor(update: MessageUseCases.UpdateMessage) { super({ update }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Deletes a message
 */
export class DeleteMessageService extends Service {
  constructor(remove: MessageUseCases.DeleteMessage) { super({ remove }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Creates a new message
 */
export class CreateMessageService extends Service {
  constructor(create: MessageUseCases.CreateMessage) { super({ create }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}
