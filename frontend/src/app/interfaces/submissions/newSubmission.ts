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

export enum SubmissionStatus {
    ACCEPTED = "accepted",
    NOT_ACCEPTED = "not_accepted"
}

export interface Submission {
    studentId: string,
    assignmentId: string,
    learningObjectId: string,
    time: Date,
    contents: string,
    taskId: string,
    id: string,
    status: SubmissionStatus
}