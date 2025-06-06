import { LearningPath } from "../entities/learningPath";

/**
 * A class to define the interface for a LearningPathRepository
 */
export abstract class ILearningPathRepository {
    /**
     * Gets all the available languages of a learningPath given it's hruid.
     * @param hruid of the learningPath.
     * @returns a promise that resolves to an array of strings containing the available languages.
     */
    public abstract getLanguages(hruid: string): Promise<string[]>;

    /**
     * Function to get a learningPath given the hruid and language.
     *
     * @param hruid of the learningPath.
     * @param includeNodes if the nodes should be included in the learningPath.
     * @param language of the learningPath can be undefined if not needed.
     *
     * @returns a promise that resolves to a learningPath.
     */
    public abstract getLearningPath(hruid: string, includeNodes: boolean, language?: string): Promise<LearningPath>;

    /**
     * Function to get all available learningPath metadata with optional params
     *
     * @param params string including the params for the query
     * @returns a promise that resolves to a list of all LearningPaths
     */
    public abstract getLearningPaths(params: string, includeNodes: boolean): Promise<LearningPath[]>;
}
