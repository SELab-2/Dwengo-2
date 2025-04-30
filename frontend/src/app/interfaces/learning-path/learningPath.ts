import { ShallowLearningObject } from "../learning-object";

export interface LearningPath {
    title: string;
    description: string;
    numNodes: number;
    minAge: number;
    maxAge: number;
    // Right now, this ID is kinda useless, but we need backend to pass this through as the one unique identifier.
    learningPathId: string;
    nodes?: ShallowLearningObject[];
    language: string;
    hruid: string;
    id: string;
}

/**
 * How to get EVERY learning path: set 'all' as an empty string, and leave the others untouched.
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
