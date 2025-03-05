import { Service } from './service';
import { Class } from '../../core/entities/class';
import { DeleteClass } from '../../core/use-cases/class/deleteClass';
import { GetClass } from '../../core/use-cases/class/getClass';
import { CreateClass } from '../../core/use-cases/class/setupClass';
import { UpdateClass } from '../../core/use-cases/class/updateClass';

/**
 * Retrieves a single Class using it's id and a user's id.
 * This could be simplified to only use the class id.
 */
export class GetClassService extends Service<Class> {
  constructor(get: GetClass) { super({ get }); }
  // TODO: implement the execute function
}

/**
 * Retrieves all Classes for a user.
 */
export class GetUserClassesService extends Service<Class[]> {
  // TODO: implement constructor with GetUserClasses use case
  // TODO: implement the execute function
}

/**
 * Updates a Class's data.
 */
export class UpdateClassService extends Service<Class> {
  constructor(update: UpdateClass) { super({ update }); }
  // TODO: implement the execute function
}

/**
 * Deletes a Class.
 */
export class DeleteClassService extends Service<void> {
  constructor(remove: DeleteClass) { super({ remove }); }
  // TODO: implement the execute function
}

/**
 * Creates a new Class.
 */
export class CreateClassService extends Service<Class> {
  // TODO: implement constructor with CreateClass use case
  // TODO: implement the execute function
}
