import { VisibilityType } from "./questionThread";

/**
 * Request body for the PATCH request to /questions/id
 */
export interface QuestionThreadUpdate {
    isClosed: boolean;
    visibility: VisibilityType;
}