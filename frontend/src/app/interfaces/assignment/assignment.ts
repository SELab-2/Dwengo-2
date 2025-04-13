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

/**
 * Interface for representing a new assignment which has no id yet
 */
export interface NewAssignment {
    classId: string,
    startDate: Date,
    deadline: Date,
    extraInstructions: string,
}
