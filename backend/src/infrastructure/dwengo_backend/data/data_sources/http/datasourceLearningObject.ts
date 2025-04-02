import { ApiError, ErrorCode } from "../../../../../application/types";
import { logger } from "../../../../../config/logger";
import { LearningObject, LearningObjectContentType } from "../../../../../core/entities/learningObject";

export class DatasourceLearningObject {
    public constructor(private readonly _host: string = "https://dwengo.org/backend") {}

    public get host(): string {
        return this._host;
    }

    public async getVersions(hruid: string): Promise<string[]> {
        const response = await fetch(`${this._host}/api/learningObject/search?hruid=${hruid}`)
        if (!response.ok) {
            throw {code: ErrorCode.BAD_REQUEST, message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`} as ApiError;
        }

        const data = await response.json();

        if (data.length === 0) {
            throw {code: ErrorCode.NOT_FOUND, message: `No objects exists with this hruid.`} as ApiError;
        }

        // Map eacht object to it's versionNumber
        return data.map((d: {version: string}) => d.version);
    }

    public async getLanguages(hruid: string): Promise<string[]> {
        const response = await fetch(`${this._host}/api/learningObject/search?hruid=${hruid}`)
        if (!response.ok) {
            throw {code: ErrorCode.BAD_REQUEST, message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`} as ApiError;
        }

        const data = await response.json();

        if (data.length === 0) {
            throw {code: ErrorCode.NOT_FOUND, message: `No objects exists with this hruid.`} as ApiError;
        }

        // Map eacht object to it's versionNumber
        return data.map((d: {language: string}) => d.language);
    }

    public async getMetaData(hruid: string, language: string, version: number) : Promise<LearningObject> {
        const params = `hruid=${hruid}&language=${language}&version=${version}`
        const response = await fetch(`${this._host}/api/learningObject/getMetaData?${params}`)
        if (!response.ok) {
            throw {code: ErrorCode.BAD_REQUEST, message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`} as ApiError;
        }

        const data = await response.json();
        return new LearningObject(
            data.hruid,
            data.uuid,
            data.id,
            data.version,
            data.language,
            data.title,
            data.description,
            "",
            data.contentType
        );
    }

    private async getLearningObject(type: string, hruid: string, language: string, version: number): Promise<LearningObject> {
        const data: LearningObject = await this.getMetaData(hruid, language, version);
            
        const params: string = `hruid=${hruid}&language=${language}&version=${version}`;
        const response = await fetch(`${this._host}/api/learningObject/${type}?${params}`)
        
        if (!response.ok) {
            throw {code: ErrorCode.BAD_REQUEST, message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`} as ApiError;
        }
        const html: string = await response.text();
        data.htmlContent = html;
        return data
    }

    public async getRawLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.getLearningObject("getRaw", hruid, language, version);
    }

    public async getWrappedLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.getLearningObject("getWrapped", hruid, language, version);
    }

    public async getLearningObjects(): Promise<LearningObject[]> {
        const response = await fetch(`${this.host}/api/learningObject/search`);
        return await response.json();
    }
}
