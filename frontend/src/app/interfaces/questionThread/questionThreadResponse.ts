/**
 * Interface for the responses of the Question API
 * when requesting a list of questions by user or by assignment.
 */
export interface QuestionThreadResponse {
    threads?: string[];
}

/**
 * Interface for the responses of the Question API
 * when requesting a single question.
 */
export interface QuestionThreadResponseSingle {
    id: string;
}