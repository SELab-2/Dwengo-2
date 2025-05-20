import { z } from "zod";
import { TaskService } from "./taskService";
import { createTaskSchema } from "../../../application/schemas/taskSchemas";
import { TaskDetails } from "../../../config/taskTypes";
import { Task } from "../../entities/task";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export class CreateTask extends TaskService<CreateTaskInput> {
    async execute(userId: string, input: CreateTaskInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, UserType.TEACHER, undefined);
        const task = new Task(input.assignmentId, input.step, input.question, input.type, input.details as TaskDetails);

        const createdTask = await tryRepoEntityOperation(
            this.taskRepository.create(task),
            "Assignment",
            input.assignmentId,
            true,
        );

        return { id: createdTask.id };
    }
}
