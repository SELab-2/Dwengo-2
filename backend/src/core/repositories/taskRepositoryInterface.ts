import { AbstractRepository } from "./abstractRepository";
import { Task } from "../entities/task";

export abstract class ITaskRepository extends AbstractRepository {
    public abstract create(task: Task): Promise<Task>;

    public abstract getById(id: string): Promise<Task>;

    public abstract getByAssignmentId(id: string, step?: number): Promise<Task[]>;

    public abstract update(task: Task): Promise<void>;

    public abstract delete(id: string): Promise<void>;
}
