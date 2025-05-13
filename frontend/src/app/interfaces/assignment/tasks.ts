export interface MultipleChoice extends AssignmentTask {
    options: string[];
    allowMultipleAnswers: boolean
    selected: number[]; // Number of the selected answer or empty
}

export interface NormalQuestion extends AssignmentTask {
    answer: string | null;
}

export interface AssignmentTask {
    question: string;
}