import { TaskService } from "./taskService";
import { getTasksSchema } from "../../../application/schemas/taskSchemas";
import { z } from "zod";

export type GetTasksInput = z.infer<typeof getTasksSchema>

export class GetTasks implements TaskService<GetTasksInput> {
    public async execute(input: GetTasksInput): Promise<object> {
        return {};
    };
}