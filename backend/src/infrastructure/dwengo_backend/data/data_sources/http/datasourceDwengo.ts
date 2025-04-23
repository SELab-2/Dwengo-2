import { ApiError, ErrorCode } from "../../../../../application/types";

// Abstract class that defines everything that is shared between learningPaths and learningObjects
export abstract class DatasourceDwengo {
    public constructor(
        protected readonly host: string = "https://dwengo.org/backend",
        protected readonly learningType: string,
    ) {}

    /**
     * Function to get all the available languages of a learningObject/learningPath
     *
     * @param hruid of the learningObject/learningPath.
     * @returns a promise that resolves to an array of the available languages.
     */
    public async getLanguages(hruid: string): Promise<string[]> {
        // Fetch from Dwengo
        const response = await fetch(`${this.host}/api/${this.learningType}/search?hruid=${hruid}`);
        if (!response.ok) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
            } as ApiError;
        }

        const data = await response.json();

        if (data.length === 0) {
            throw { code: ErrorCode.NOT_FOUND, message: `No objects exists with this hruid.` } as ApiError;
        }

        // Map each object to it's language
        return data.map((d: { language: string }) => d.language);
    }
}
