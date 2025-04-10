/**
 * An assignment object
 */
export interface Assignment {
    id: string,
    classId: string,
    learningPathId?: string,
    startDate: string,
    deadline: string,
    extraInstructions: string,
}
