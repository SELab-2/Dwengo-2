export interface LearningPath {
    title: string;
    description: string;
    numNodes: number;
    minAge: number;
    maxAge: number;
    learningPathId: string;
    language: string;
}

export interface LearningPathRequest {
    all?: string;
    hruid?: string;
    title?: string;
    description?: string;
    language?: string;
}
