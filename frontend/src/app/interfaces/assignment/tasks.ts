import { TaskType } from "../../components/create-task/create-task-component/create-task.component";

export interface MultipleChoice extends AssignmentTask {
    options: string[];
    allowMultipleAnswers: boolean
    correctAnswers: number[];
    selected: number[]; // Number of the selected answer or empty
}

export interface NormalQuestion extends AssignmentTask {
    predefined_answer: string | null; // This is the 'correct' answer, optional
    answer: string | null; // When an answer to the question is given, it is displayed here
}

export interface AssignmentTask {
    question: string;
}

export interface MultipleChoiceRequest extends AssignmentTask {
    type: TaskType;
    options: string[];
    allowMultipleAnswers: boolean;
    correctAnsers: number[];
}

export interface NormalQuestionRequest extends AssignmentTask {
    type: TaskType;
    predefined_answer: string | null;
}

export interface AssignmentTaskResponse {
    type: TaskType;
    taskObject: AssignmentTask;
}