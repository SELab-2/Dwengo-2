import { Task } from "../../core/entities/task";
import { ITaskRepository } from "../../core/repositories/taskRepositoryInterface";
import { DatasourceTaskTypeORM } from "../database/data/data_sources/typeorm/datasourceTaskTypeORM";

export class TaskRepository extends ITaskRepository {
    private datasourceTask: DatasourceTaskTypeORM;

    public constructor() {
        super();
        this.datasourceTask = new DatasourceTaskTypeORM();
    }

    public async create(task: Task): Promise<Task> {
        return await this.datasourceTask.create(task);
    }
    public async getById(id: string): Promise<Task> {
        return await this.datasourceTask.getById(id);
    }
    public async getByAssignmentId(id: string, step?: number): Promise<Task[]> {
        return await this.datasourceTask.getByAssignmentId(id, step);
    }
    public async delete(id: string): Promise<void> {
        await this.datasourceTask.delete(id);
    }

}