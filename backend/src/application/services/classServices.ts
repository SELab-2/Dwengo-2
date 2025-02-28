import { Class } from "../../infrastructure/database/data/data_models/classTypeorm";
import { Service } from "./service";

// TODO: add other imports for usecases

export class Get extends Service<Class> {
  constructor(get: GetClass) { super({ get }); }
  execute(classId: UUID) { return this.usecases.get.execute(classId); }
}

export class UserGet extends Service<Class[]> {
  constructor(get: GetUserClasses) { super({ get }); }
  execute(userId: UUID, page: number, size: number) { return this.usecases.get.execute(userID, page, size); }
}

export class Update extends Service<Class> {
  constructor(update: UpdateClass) { super({ update }); }
  execute(classId: UUID, data: object) { return this.usecases.update.execute(classId, data); }
}

export class Delete extends Service<Class[]> {
  constructor(remove: DeleteClass) { super({ remove }); }
  execute(classId: UUID) { return this.usecases.remove.execute(classId); }
}

export class Create extends Service<Class> {
  constructor(create: CreateClass) { super({ create }); }
  execute(data: object) { return this.usecases.create.execute(data); }
}
