import { DatasourceDwengo } from "./datasourceDwengo";
import { ApiError, ErrorCode } from "../../../../../application/types";
import { LearningPath, LearningPathData } from "../../../../../core/entities/learningPath";

export class DatasourceLearningPath extends DatasourceDwengo {
    public constructor(host?: string) {
        super(host, "learningPath");
    }

    public async getLearningPath(hruid: string, language: string): Promise<LearningPath> {
        // Fetch from dwengo
        const response = await fetch(`${this.host}/api/${this.learningType}/search?hruid=${hruid}`);
        if (!response.ok) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
            } as ApiError;
        }

        // Update html-content
        const data = await response.json();
        if (data.length === 0) {
            throw { code: ErrorCode.NOT_FOUND, message: `No learningPath exists with this hruid.` } as ApiError;
        }

        // Extract the right language from all the available paths
        // (Dwengo API for some reason can't do this with &language=${language} in the query)
        const learningPathObject: LearningPathData = data.find((path: LearningPathData) => path.language === language);
        if (!learningPathObject) {
            // Should not happen because language is checked beforehand, but just to be sure.
            throw { code: ErrorCode.NOT_FOUND, message: `No learningPath exists with this hruid.` } as ApiError;
        }
        return LearningPath.fromObject(learningPathObject);
    }

    /**
     * Function that gets all the learningPaths from the Dwengo API
     *
     * @returns a promise that resolves to an array of all learningPaths from the Dwengo API.
     */
    public async getLearningPaths(): Promise<LearningPath[]> {
        const response = await fetch(`${this.host}/api/${this.learningType}/search`);

        // Map all objects to LearningPath
        return (await response.json()).map((o: LearningPathData) => LearningPath.fromObject(o));
    }
}
