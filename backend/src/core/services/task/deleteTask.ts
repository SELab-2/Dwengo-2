import { z } from "zod";
import { TaskService } from "./taskService";
import { deleteTaskSchema } from "../../../application/schemas/taskSchemas";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

export class DeleteTask extends TaskService<DeleteTaskInput> {
    async execute(userId: string, input: DeleteTaskInput): Promise<object> {
        await validateUserRights(userId, UserType.TEACHER);
        await tryRepoEntityOperation(this.taskRepository.delete(input.id), "Task", input.id, true);
        return {};
    }
}
