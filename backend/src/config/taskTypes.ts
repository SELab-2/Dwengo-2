export enum TaskType {
    NormalQuestion = "NORMALQUESTION",
    MultipleChoice = "MULTIPLECHOICE",
}

export interface MultipleChoiceDetails {
    options: string[];
    correctAnswers: number[];
    allowMultipleAnswers?: boolean;
}

export interface NormalQuestionDetails {
    predefined_answer?: string;
}

export type TaskDetails = MultipleChoiceDetails | NormalQuestionDetails;

