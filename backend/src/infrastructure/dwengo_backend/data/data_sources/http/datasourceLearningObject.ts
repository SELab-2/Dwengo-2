import { DatasourceDwengo } from "./datasourceDwengo";
import { ApiError, ErrorCode } from "../../../../../application/types";
import { LearningObject, LearningObjectData } from "../../../../../core/entities/learningObject";

export class DatasourceLearningObject extends DatasourceDwengo {
    public constructor(host?: string) {
        super(host, "learningObject");
    }

    /**
     * Function to get all the available versions of a learningObject
     *
     * @param hruid of the learningObject.
     * @returns a promise that resolves to an array of the available version.
     */
    public async getVersions(hruid: string): Promise<string[]> {
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

        // Map each object to it's version
        return data.map((d: { version: string }) => d.version);
    }

    /**
     * Function that retrieves the metadata of a given learningObject.
     *
     * @param hruid of the learningObject.
     * @param language of the learningObject.
     * @param version of the learningObject.
     * @returns a promise that resolved to a learningObject containing only metadata and no html-content
     */
    public async getMetaData(hruid: string, language: string, version: number): Promise<LearningObject> {
        // Fetch from dwengo
        const params = `hruid=${hruid}&language=${language}&version=${version}`;
        const response = await fetch(`${this.host}/api/${this.learningType}/getMetaData?${params}`);
        if (!response.ok) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
            } as ApiError;
        }

        const data: LearningObjectData = await response.json();
        return LearningObject.fromObject(data);
    }

    /**
     * Helper function that gets the metadata for a learningObject + wrapped/raw html-content from the dwengo API
     *
     * @param type of the html-content (raw/wrapped).
     * @param hruid of the learningObject.
     * @param language of the learningObject.
     * @param version of the learningObject.
     * @returns a promise that resolves to a LearningObject containing metadata + html-content.
     */
    private async getLearningObject(
        type: string,
        hruid: string,
        language: string,
        version: number,
    ): Promise<LearningObject> {
        // Get the metadata
        const data: LearningObject = await this.getMetaData(hruid, language, version);

        // Fetch from dwengo
        const params: string = `hruid=${hruid}&language=${language}&version=${version}`;
        const response = await fetch(`${this.host}/api/${this.learningType}/${type}?${params}`);
        if (!response.ok) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
            } as ApiError;
        }

        // Update html-content
        const html: string = await response.text();
        data.htmlContent = html;
        return data;
    }

    /**
     * Function that gets a learningObject from the Dwengo API with raw html-content.
     *
     * @param hruid of the learningObject.
     * @param language of the learningObject.
     * @param version of the learningObject.
     * @returns a promise that resolves to a LearningObject containing metadata + raw html-content.
     */
    public async getRawLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.getLearningObject("getRaw", hruid, language, version);
    }

    /**
     * Function that gets a learningObject from the Dwengo API with wrapped html-content.
     *
     * @param hruid of the learningObject.
     * @param language of the learningObject.
     * @param version of the learningObject.
     * @returns a promise that resolves to a LearningObject containing metadata + wrapped html-content.
     */
    public async getWrappedLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.getLearningObject("getWrapped", hruid, language, version);
    }

    /**
     * Function that gets all the learningObjects from the Dwengo API
     *
     * @returns a promise that resolves to an array of all learningObjects from the Dwengo API.
     */
    public async getLearningObjects(params: string): Promise<LearningObject[]> {
        const response = await fetch(`${this.host}/api/${this.learningType}/search${params}`);

        // Map all objects to LearningObjects
        return (await response.json()).map((o: LearningObjectData) => LearningObject.fromObject(o));
    }
}
