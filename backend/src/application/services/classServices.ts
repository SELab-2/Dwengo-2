import { Service } from './service';
import * as ClassUseCases from '../../core/use-cases/class';

/**
 * Retrieves a single Class using it's id and a user's id.
 * This could be simplified to only use the class id.
 */
export class GetClassService extends Service {
  constructor(get: ClassUseCases.GetClass) { super({ get }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Retrieves all Classes for a user.
 */
export class GetUserClassesService extends Service {
  constructor(getUserClasses: ClassUseCases.GetUserClasses) { super({ getUserClasses }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Updates a Class's data.
 */
export class UpdateClassService extends Service {
  constructor(update: ClassUseCases.UpdateClass) { super({ update }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Deletes a Class.
 */
export class DeleteClassService extends Service {
  constructor(remove: ClassUseCases.DeleteClass) { super({ remove }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}

/**
 * Creates a new Class.
 */
export class CreateClassService extends Service {
  constructor(create: ClassUseCases.CreateClass) { super({ create }); }
  // TODO: implement the execute function
  public execute() {
    return {
      
    }
  }
}
