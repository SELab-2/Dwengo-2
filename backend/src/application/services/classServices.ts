import { Service } from './service';
import { Class } from '../../core/entities/class';
import { DeleteClass } from '../../core/use-cases/class/deleteClass';
import { GetClass } from '../../core/use-cases/class/getClass';
import { SetupClass } from '../../core/use-cases/class/setupClass';
import { UpdateClass } from '../../core/use-cases/class/updateClass';

export class Get extends Service<Class> {
  constructor(get: GetClass) { super({ get }); }
  // TODO: implement the execute function
}

export class UserGet extends Service<Class> {
  // TODO: implement constructor with UserGetClass use case
  // TODO: implement the execute function
}

export class Update extends Service<Class> {
  constructor(update: UpdateClass) { super({ update }); }
  // TODO: implement the execute function
}

export class Delete extends Service<Class> {
  constructor(remove: DeleteClass) { super({ remove }); }
  // TODO: implement the execute function
}

export class Create extends Service<Class> {
  constructor(create: SetupClass) { super({ create }); }
  // TODO: implement the execute function
}
