import { LearningObject } from "../entities/learningObject";

/**
 * A class to define the interface for a LearningObjectRepository
 */
export abstract class ILearningObjectRepository {
    /**
     * Gets all the available versions of a learningObject given it's hruid.
     * @param hruid of the learningObject.
     * @returns a promise that resolves to an array of strings containing the available versions.
     */
    public abstract getVersions(hruid: string): Promise<string[]>;

    /**
     * Gets all the available languages of a learningObject given it's hruid.
     * @param hruid of the learningObject.
     * @returns a promise that resolves to an array of strings containing the available languages.
     */
    public abstract getLanguages(hruid: string): Promise<string[]>;

    /**
     * Function to get a learningObject given the hruid, language and version.
     *
     * @param hruid of the learningObject.
     * @param language of the learningObject.
     * @param version of the learningObject.
     *
     * @returns a promise that resolves to a LearningObject containing the raw HTML-content + metadata
     */
    public abstract getRawLearningObject(hruid: string, language: string, version: number): Promise<LearningObject>;

    /**
     * Function to get a learningObject given the hruid, language and version.
     *
     * @param hruid of the learningObject.
     * @param language of the learningObject.
     * @param version of the learningObject.
     *
     * @returns a promise that resolves to a LearningObject containing the wrapped HTML-content + metadata
     */
    public abstract getWrappedLearningObject(hruid: string, language: string, version: number): Promise<LearningObject>;

    /**
     * Function to get all available learningObjects metadata
     *
     * @param param a param string including all the filters to add to the search
     * @returns a promise that resolves to a list of all LearningObjects
     */
    public abstract getLearningObjects(params: string): Promise<LearningObject[]>;
}
