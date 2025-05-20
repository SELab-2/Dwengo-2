import { z } from "zod";
import { TaskService } from "./taskService";
import { updateTaskSchema } from "../../../application/schemas";
import { Task } from "../../entities/task";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers"; // Adjust the path if needed

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export class UpdateTask extends TaskService<UpdateTaskInput> {
    /**
     * Executes the task update process.
     * @param input - The input data for updating a task, validated by updateTaskSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the task with the given id is not found.
     */
    async execute(userId: string, input: UpdateTaskInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, UserType.TEACHER, undefined);
        const task: Task = await tryRepoEntityOperation(this.taskRepository.getById(input.id), "Task", input.id, true);
        task.assignmentId = input.assignmentId || task.assignmentId;
        task.step = input.step || task.step;
        task.question = input.question || task.question;
        task.type = input.type || task.type;
        task.details = input.details || task.details;

        await tryRepoEntityOperation(this.taskRepository.update(task), "Task", input.id, true);
        return {};
    }
}
