import { TaskService } from "./taskService";
import { createTaskSchema } from "../../../application/schemas/taskSchemas";
import { z } from "zod";
import { ITaskRepository } from "../../repositories/taskRepositoryInterface";
import { Task } from "../../entities/task";
import { INSPECT_MAX_BYTES } from "buffer";
import { TaskDetails } from "../../../config/taskTypes";
import { tryRepoEntityOperation } from "../../helpers";

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export class CreateTask extends TaskService<CreateTaskInput> {

    async execute(input: CreateTaskInput): Promise<object> {
        const task = new Task(
            input.assignmentId,
            input.step,
            input.question,
            input.type,
            input.details as TaskDetails
        );

        const createdTask = await tryRepoEntityOperation(
            this.taskRepository.create(task)
            , 'Assignment'
            , input.assignmentId
            , true
        );

        return { id: createdTask.id };
    }
}