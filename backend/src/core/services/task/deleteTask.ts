import { TaskService } from "./taskService";
import { deleteTaskSchema } from "../../../application/schemas/taskSchemas";
import { z } from "zod";

export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>

export class DeleteTask implements TaskService<DeleteTaskInput> {
    public async execute(input: DeleteTaskInput): Promise<object> {
        return {};
    };
}