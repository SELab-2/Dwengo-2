import { z } from "zod";
import { TaskService } from "./taskService";
import { getTasksSchema } from "../../../application/schemas/taskSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type GetTasksInput = z.infer<typeof getTasksSchema>;

export class GetTasks extends TaskService<GetTasksInput> {
    public async execute(_userId: string, input: GetTasksInput): Promise<object> {
        const tasks = await tryRepoEntityOperation(
            this.taskRepository.getByAssignmentId(input.idParent, input.step),
            "Assignment | Step",
            `${input.idParent} | ${input.step}`,
            true,
        );

        return { tasks: tasks.map(task => task.id) };
    }
}
