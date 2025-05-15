import { TaskService } from "./taskService";
import { getTaskSchema } from "../../../application/schemas/taskSchemas";
import { z } from "zod";

export type GetTaskInput = z.infer<typeof getTaskSchema>

export class GetTask implements TaskService<GetTaskInput> {
    public async execute(input: GetTaskInput): Promise<object> {
        return {};
    };
}