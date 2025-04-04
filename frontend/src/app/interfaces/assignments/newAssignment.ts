/**
 * Interface for an assignment that is new.
 * This contains the fields of the create assignment form
 */
export interface NewAssignment {
    classId: string,
    learningPathId: string,
    startDate: string,
    deadline: string,
    extraInstructions: string,
}
