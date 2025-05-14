export interface Progress {
    id: string,
    studentId: string,
    assignmentId: string,
    learningObjectId: string,
    step: number,
    maxStep: number,
    time: string
}