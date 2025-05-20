import { Service } from "../../../config/service";
import { ITaskRepository } from "../../repositories/taskRepositoryInterface";

export abstract class TaskService<T> implements Service<T> {
    constructor(protected taskRepository: ITaskRepository) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
