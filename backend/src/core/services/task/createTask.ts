import { TaskService } from "./taskService";
import { createTaskSchema } from "../../../application/schemas/taskSchemas";
import { z } from "zod";

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export class CreateTask implements TaskService<CreateTaskInput> {
    public async execute(input: CreateTaskInput): Promise<object> {
        return {};
    };
}