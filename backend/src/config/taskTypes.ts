export enum TaskType {
    NormalQuestion,
    MultipleChoice,
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