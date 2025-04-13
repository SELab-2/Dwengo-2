/**
 * Interface for the responses of the Assignment API
 * when requesting a list of assignments by user.
 */
export interface AssignmentResponse {
    assignments: string[];
}

/**
 * Interface for the responses of the Assignment API
 * when requesting a single assignment.
 */
export interface AssignmentResponseSingle {
    id: string;
}
