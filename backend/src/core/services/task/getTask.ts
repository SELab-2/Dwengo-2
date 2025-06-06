import { z } from "zod";
import { TaskService } from "./taskService";
import { getTaskSchema } from "../../../application/schemas/taskSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type GetTaskInput = z.infer<typeof getTaskSchema>;

export class GetTask extends TaskService<GetTaskInput> {
    public async execute(_userId: string, input: GetTaskInput): Promise<object> {
        const task = await tryRepoEntityOperation(this.taskRepository.getById(input.id), "Task", input.id, true);

        return task.toObject();
    }
}
