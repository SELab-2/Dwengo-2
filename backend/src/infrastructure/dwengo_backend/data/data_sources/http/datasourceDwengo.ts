// Abstract class that defines everything that is shared between learningPaths and learningObjects
export abstract class DatasourceDwengo {
    public constructor(protected readonly host: string = "https://dwengo.org/backend") {}

    /**
     * Function to get all the available languages of a learningObject/learningPath
     *
     * @param hruid of the learningObject/learningPath.
     * @returns a promise that resolves to an array of the available languages.
     */
    public abstract getLanguages(hruid: string): Promise<string[]>;
}
