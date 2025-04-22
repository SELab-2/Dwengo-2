import { LearningPath } from "./learningPath";

export interface LearningPathResponse {
    learningPaths: LearningPath[];
}

export interface OneLearningPathResponse {
    learningPath: LearningPath;
}