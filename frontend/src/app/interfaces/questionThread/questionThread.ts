export enum VisibilityType {
    PUBLIC = "public",
    PRIVATE = "private",
    GROUP = "group",
}


/**
 * Interface for representing a question thread.
 */
export interface QuestionThread {
    id: string,
    creatorId: string,
    assignmentId: string,
    learningObjectId?: string,
    isClosed: boolean,
    visibility: VisibilityType,
    messageIds?: string[],
}

/**
 * Interface for representing a new question which has no id yet
 */
export interface NewQuestionThread {
    creatorId: string,
    assignmentId: string,
    learningObjectId: string,
    isClosed: boolean,
    visibility: VisibilityType,
}
