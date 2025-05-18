/**
 * Interface for a submission that is new.
 */
export interface NewSubmission {
    studentId: string,
    assignmentId: string,
    learningObjectId: string,
    time: Date,
    contents: string,
    taskId: string,
}

export interface Submission {
    studentId: string,
    assignmentId: string,
    learningObjectId: string,
    time: Date,
    contents: string,
    taskId: string,
    id: string,
}