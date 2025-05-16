import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Task } from "../../../../../core/entities/task";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { TaskTypeORM } from "../../data_models/taskTypeORM";

export class DatasourceTaskTypeORM extends DatasourceTypeORM {
    public async create(task: Task): Promise<Task> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModel = await datasource.getRepository(AssignmentTypeORM).findOne({
            where: { id: task.assignmentId },
        });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with ${task.assignmentId} not found`);
        }

        const taskTypeORM = TaskTypeORM.createTaskTypeORM(task, assignmentModel);

        const savedTask = await datasource.getRepository(TaskTypeORM).save(taskTypeORM);

        return savedTask.toEntity();
    }

    public async getById(taskId: string): Promise<Task> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const taskModel = await datasource.getRepository(TaskTypeORM).findOne({
            where: { id: taskId },
            relations: ["assignment"],
        });

        if (!taskModel) {
            throw new EntityNotFoundError(`Task with id: ${taskId} not found`);
        }
        return taskModel.toEntity();
    }

    public async getByAssignmentId(assignmentId: string, step?: number): Promise<Task[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModel = await datasource.getRepository(AssignmentTypeORM).findOne({
            where: { id: assignmentId },
        });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with ${assignmentId} not found`);
        }

        if (step) {
            const taskModels = await datasource.getRepository(TaskTypeORM).find({
                where: { assignment: assignmentModel, step: step },
                relations: ["assignment"],
            });
            return taskModels.map(taskModel => taskModel.toEntity());
        }

        const taskModels = await datasource.getRepository(TaskTypeORM).find({
            where: { assignment: assignmentModel },
            relations: ["assignment"],
        });
        return taskModels.map(taskModel => taskModel.toEntity());
    }

    public async delete(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const taskModel = await datasource.getRepository(TaskTypeORM).findOne({ where: { id: id } });

        if (!taskModel) {
            throw new EntityNotFoundError(`Task with id: ${id} not found`);
        }

        await datasource.getRepository(TaskTypeORM).delete(taskModel.id);
    }
}
