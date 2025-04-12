/**
 * Interface for representing an assignment.
 */
export interface Assignment {
    id: string,
    classId: string,
    startDate: Date,
    deadline: Date,
    extraInstructions: string,
}
