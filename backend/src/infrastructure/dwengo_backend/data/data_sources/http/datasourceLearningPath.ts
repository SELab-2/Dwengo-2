import { DatasourceDwengo } from "./datasourceDwengo";
import { ApiError, ErrorCode } from "../../../../../application/types";
import { LearningPath, LearningPathData } from "../../../../../core/entities/learningPath";

export class DatasourceLearningPath extends DatasourceDwengo {
    public constructor(host?: string) {
        super(host, "learningPath");
    }

    private cache: LearningPathData[] | null = null;
    private cacheTimestamp: number = 0;
    private readonly CACHE_TTL = 12 * 60 * 60 * 1000; // 12u
    protected async getAllLearningPathsCached(): Promise<LearningPathData[]> {
        const now = Date.now();
        if (this.cache && now - this.cacheTimestamp < this.CACHE_TTL) {
            return this.cache;
        }
        const response = await fetch(`${this.host}/api/${this.learningType}/search?all=`);
        if (!response.ok) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
            } as ApiError;
        }
        this.cache = await response.json();
        this.cacheTimestamp = now;
        return this.cache!;
    }

    public async getLearningPath(hruid: string, includeNodes: boolean, language?: string): Promise<LearningPath> {
        // Fetch from dwengo or get from cache
        const data = await this.getAllLearningPathsCached();
        const matching = data.filter((path) => path.hruid === hruid);
        console.log(matching)

        if (matching.length === 0) {
            throw { code: ErrorCode.NOT_FOUND, message: `No learningPath exists with this hruid.` } as ApiError;
        }

        // Extract the right language from all the available paths
        // (Dwengo API for some reason can't do this with &language=${language} in the query)
        const learningPathObject: LearningPathData | undefined = language
            ? matching.find((path: LearningPathData) => path.language === language)
            : matching[0];
        if (!learningPathObject) {
            // Should not happen because language is checked beforehand, but just to be sure.
            throw { code: ErrorCode.NOT_FOUND, message: `No learningPath exists in this language.` } as ApiError;
        }
        return LearningPath.fromObject(learningPathObject, includeNodes);
    }

    /**
     * Function that gets all the learningPaths from the Dwengo API
     *
     * @returns a promise that resolves to an array of all learningPaths from the Dwengo API.
     */
    public async getLearningPaths(params: string, includeNodes: boolean): Promise<LearningPath[]> {
        const response = await fetch(`${this.host}/api/${this.learningType}/search${params}`);
        if (!response.ok) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
            } as ApiError;
        }
        // Map all objects to a LearningPath
        return (await response.json()).map((o: LearningPathData) => LearningPath.fromObject(o, includeNodes));
    }
}
