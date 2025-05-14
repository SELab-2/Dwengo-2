/**
 * Interface for a submission that is new.
 */
export interface NewSubmission {
    studentId: string,
    assignmentId: string,
    learningObjectId: string,
    time: Date,
    contents: string,
}