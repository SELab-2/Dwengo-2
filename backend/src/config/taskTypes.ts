export enum TaskType {
    NormalQuestion = "NORMALQUESTION",
    MultipleChoice = "MULTIPLECHOICE",
    Other = "OTHER",
}

export interface MultipleChoiceDetails {
    options: string[];
    correctAnswers: number[];
    allowMultipleAnswers?: boolean;
}

export interface NormalQuestionDetails {
    predefined_answer?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OtherDetails {}

export type TaskDetails = MultipleChoiceDetails | NormalQuestionDetails | OtherDetails;
