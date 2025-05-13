export interface MultipleChoice extends AssignmentTask {
    options: string[];
    allowMultipleAnswers: boolean
    selected: number[]; // Number of the selected answer or empty
}

export interface NormalQuestion extends AssignmentTask {
    predefined_answer: string | null; // This is the 'correct' answer, optional
    answer: string | null; // When an answer to the question is given, it is displayed here
}

export interface AssignmentTask {
    question: string;
}