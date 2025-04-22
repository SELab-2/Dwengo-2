import { ShallowLearningObject } from "../learning-object";

export interface LearningPath {
    title: string;
    description: string;
    numNodes: number;
    minAge: number;
    maxAge: number;
    learningPathId: string;
    nodes?: ShallowLearningObject[];
    language: string;
}

/**
 * How to get EVERY learning path: simply don't fill in anything.
 * How to get one specific learning path: specify hruid and language.
 */
export interface LearningPathRequest {
    // Search <string> in every title, description and hruid
    all?: string;

    // Only search for hruid's that match <string>
    hruid?: string;

    // ...
    title?: string;
    description?: string;

    // Search for language by country code
    language?: string;

    // With or without the inclusion of nodes
    includeNodes?: boolean;
}

// To make sure you get a specific learning path, some fields are mandatory
export interface SpecificLearningPathRequest {
    hruid: string;
    language?: string;
    includeNodes?: boolean;
}
