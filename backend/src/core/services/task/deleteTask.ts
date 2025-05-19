import { z } from "zod";
import { TaskService } from "./taskService";
import { deleteTaskSchema } from "../../../application/schemas/taskSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

export class DeleteTask extends TaskService<DeleteTaskInput> {
    async execute(input: DeleteTaskInput): Promise<object> {
        await tryRepoEntityOperation(this.taskRepository.delete(input.id), "Task", input.id, true);
        return {};
    }
}
