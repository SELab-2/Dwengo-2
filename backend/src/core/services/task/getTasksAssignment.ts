import { TaskService } from "./taskService";
import { getTasksSchema } from "../../../application/schemas/taskSchemas";
import { z } from "zod";
import { tryRepoEntityOperation } from "../../helpers";

export type GetTasksInput = z.infer<typeof getTasksSchema>

export class GetTasks extends TaskService<GetTasksInput> {

    public async execute(input: GetTasksInput): Promise<object> {
        const tasks = await tryRepoEntityOperation(
            this.taskRepository.getByAssignmentId(input.assignmentId, input.step)
            , "Assignment | Step"
            , `${input.assignmentId} | ${input.step}`
            , true
        );

        return { tasks: tasks.map(task => task.id) };
    };
}