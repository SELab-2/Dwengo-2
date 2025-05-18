import { TaskType } from "./taskType";

export interface GetTasksRequest {
    assignmentId: string;
    step?: number; // The number of the object in the list, should be in query
}

export interface GetTasksResponse {
    // List of the task ID's that match the request
    tasks: string[]
}

export interface GetOneTaskRequest {
    taskId: string;
}

// The response for this is a normal Task