import { Service } from './service';
import { Class } from '../../core/entities/class';
import { DeleteClass } from '../../core/use-cases/class/deleteClass';
import { GetClass } from '../../core/use-cases/class/getClass';
import { SetupClass } from '../../core/use-cases/class/setupClass';
import { UpdateClass } from '../../core/use-cases/class/updateClass';

export class GetClassService extends Service<Class> {
  constructor(get: GetClass) { super({ get }); }
  // TODO: implement the execute function
}

export class GetUserClassesService extends Service<Class[]> {
  // TODO: implement constructor with GetUserClasses use case
  // TODO: implement the execute function
}

export class UpdateClassService extends Service<Class> {
  constructor(update: UpdateClass) { super({ update }); }
  // TODO: implement the execute function
}

export class DeleteClassService extends Service<void> {
  constructor(remove: DeleteClass) { super({ remove }); }
  // TODO: implement the execute function
}

export class CreateClassService extends Service<Class> {
  constructor(create: SetupClass) { super({ create }); }
  // TODO: implement the execute function
}
