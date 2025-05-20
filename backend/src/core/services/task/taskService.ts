import { Service } from "../../../config/service";
import { ITaskRepository } from "../../repositories/taskRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export abstract class TaskService<T> implements Service<T> {
    constructor(
        protected taskRepository: ITaskRepository,
        protected userRepository: IUserRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
