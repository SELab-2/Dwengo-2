import { DatasourceDwengo } from "./datasourceDwengo";
import { ApiError, ErrorCode } from "../../../../../application/types";
import { LearningPath, LearningPathData } from "../../../../../core/entities/learningPath";

export class DatasourceLearningPath extends DatasourceDwengo {
    private learningType: string = "learningPath";
    public constructor(host?: string) {
        super(host);
    }

    // Map hruid -> language -> path
    private cache: Map<string, Map<string, LearningPathData>> | null = null;
    private cacheTimestamp: number = 0;
    private readonly CACHE_TTL = 12 * 60 * 60 * 1000; // 12u

    protected async getAllLearningPathsCached(): Promise<Map<string, Map<string, LearningPathData>>> {
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

        const allPaths: LearningPathData[] = await response.json();
        const newCache = new Map<string, Map<string, LearningPathData>>();
        for (const lp of allPaths) {
            if (!newCache.has(lp.hruid)) {
                newCache.set(lp.hruid, new Map());
            }
            newCache.get(lp.hruid)!.set(lp.language, lp);
        }

        this.cache = newCache;
        this.cacheTimestamp = now;
        return this.cache;
    }

    public async getLanguages(hruid: string): Promise<string[]> {
        const cache = await this.getAllLearningPathsCached();
        const hruidMap = cache.get(hruid);
        if (!hruidMap) {
            throw { code: ErrorCode.NOT_FOUND, message: `No learningPath exists with this hruid.` } as ApiError;
        }
        return Array.from(hruidMap.keys());
    }

    public async getLearningPath(hruid: string, includeNodes: boolean, language?: string): Promise<LearningPath> {
        // Fetch from dwengo or get from cache
        const cache = await this.getAllLearningPathsCached();
        const hruidMap = cache.get(hruid);
        if (!hruidMap) {
            throw { code: ErrorCode.NOT_FOUND, message: `No learningPath exists with this hruid.` } as ApiError;
        }

        const lp = language ? hruidMap.get(language) : hruidMap.values().next().value;
        if (!lp) {
            throw { code: ErrorCode.NOT_FOUND, message: `No learningPath exists in this language.` } as ApiError;
        }

        return LearningPath.fromObject(lp, includeNodes);
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
