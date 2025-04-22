export interface LearningPath {
    title: string;
    description: string;
    numNodes: number;
    minAge: number;
    maxAge: number;
    learningPathId: string;
    language: string;
    nodes: {};
}

export interface LearningPathRequest {
    // string will be searched in Title, Hruid and Description
    all?: string;

    // string will be searched in hruid
    hruid?: string;

    //...
    title?: string;
    description?: string;

    // two-letter country code (lowercase)
    language?: string;

}
