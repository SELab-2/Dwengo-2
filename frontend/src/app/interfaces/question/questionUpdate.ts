import { VisibilityType } from "./question";

/**
 * Request body for the PATCH request to /questions/id
 */
export interface QuestionUpdate {
    isClosed: boolean;
    visibility: VisibilityType;
}