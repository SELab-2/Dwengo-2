import { TaskType } from "./taskType";

// eslint-disable-next-line
export interface TaskDetails {

}

export interface NormalQuestionTask extends TaskDetails {
    predefined_answer: string
}

export interface MultipleChoiceTask extends TaskDetails {
    options: string[];
    correctAnswers: number[];
    allowMultipleAnswers?: boolean;
}

export interface Task {
    assignmentId: string;
    step: number;
    question: string;
    type: TaskType;
    details: TaskDetails
}