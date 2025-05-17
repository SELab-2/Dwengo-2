import { DatasourceDwengo } from "./datasourceDwengo";
import { ApiError, ErrorCode } from "../../../../../application/types";
import { LearningObject, LearningObjectData } from "../../../../../core/entities/learningObject";

export class DatasourceLearningObject extends DatasourceDwengo {
    private learningType: string = "learningObject";
    public constructor(host?: string) {
        super(host);
    }

    private metaDataCache: Map<string, LearningObject[]> | null = null;
    private cacheTimestamp: number = 0;
    private isRefreshing: boolean = false;
    private readonly CACHE_TTL = 12 * 60 * 60 * 1000; // 12u

    private async fetchAllMetaData(): Promise<Map<string, LearningObject[]>> {
        // Fetch all learningObjects from dwengo
        const response = await fetch(`${this.host}/api/${this.learningType}/search`);
        if (!response.ok) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
            } as ApiError;
        }
        const allData: LearningObjectData[] = await response.json();

        // Fill the cache with the data
        const newCache = new Map<string, LearningObject[]>();
        for (const loData of allData) {
            const lo = LearningObject.fromObject(loData);
            const list = newCache.get(lo.hruid) ?? [];
            list.push(lo);
            newCache.set(lo.hruid, list);
        }

        return newCache;
    }

    private async refreshMetaDataCache(): Promise<void> {
        // Make sure another function isn't refreshing the cache at this moment
        if (this.isRefreshing) return;
        this.isRefreshing = true;
        try {
            const freshCache = await this.fetchAllMetaData();
            this.metaDataCache = freshCache;
            this.cacheTimestamp = Date.now();
        } catch (error) {
            console.warn("Failed to refresh metadata cache:", error);
        } finally {
            this.isRefreshing = false;
        }
    }

    private async fallback(url: string, hruid: string): Promise<LearningObjectData[]> {
        // Fallback to fetch if cache is empty and data needed
            const response = await fetch(url);
            if (!response.ok) {
                throw {
                    code: ErrorCode.BAD_REQUEST,
                    message: `Error fetching from dwengo api: ${response.status}, ${response.statusText}`,
                } as ApiError;
            }
            const fallbackCandidates: LearningObjectData[] = await response.json();

            if (!fallbackCandidates) {
                throw {
                    code: ErrorCode.NOT_FOUND,
                    message: `LearningObject with hruid ${hruid} not found.`,
                } as ApiError;
            }
            return fallbackCandidates
    }

    /**
     * Function to get all the available versions of a learningObject
     *
     * @param hruid of the learningObject.
     * @returns a promise that resolves to an array of the available version.
     */
    public async getVersions(hruid: string): Promise<string[]> {
        const now = Date.now();
        const shouldUpdateCache = now - this.cacheTimestamp > this.CACHE_TTL;

        // async refresh without await, make sure first user filling cache doesn't have to wait on the whole cache
        if (shouldUpdateCache) {
            this.refreshMetaDataCache(); 
        }

        // If there is no outdated cache that we can use, first ever request
        if (!this.metaDataCache) {
            const url = `${this.host}/api/${this.learningType}/search?hruid=${hruid}`;
            const fallbackCandidates: LearningObjectData[] = await this.fallback(url, hruid);
            return fallbackCandidates.map(o => o.version + "");
        }

        // Use outdated cache while refreshing
        const candidates = this.metaDataCache.get(hruid);
        if (!candidates) {
            throw {
                code: ErrorCode.NOT_FOUND,
                message: `LearningObject with hruid ${hruid} not found.`,
            } as ApiError;
        }

        // Map the objects to their version
        return candidates.map(o => o.version + "");
    }

    public async getLanguages(hruid: string): Promise<string[]> {
        const now = Date.now();
        const shouldUpdateCache = now - this.cacheTimestamp > this.CACHE_TTL;

        // async refresh without await, make sure first user filling cache doesn't have to wait on the whole cache
        if (shouldUpdateCache) {
            this.refreshMetaDataCache(); 
        }

        // If there is no outdated cache that we can use, first ever request
        if (!this.metaDataCache) {
            const url = `${this.host}/api/${this.learningType}/search?hruid=${hruid}`;
            const fallbackCandidates: LearningObjectData[] = await this.fallback(url, hruid);
            return fallbackCandidates.map(o => o.language);
        }

        // Use outdated cache while refreshing
        const candidates = this.metaDataCache.get(hruid);
        if (!candidates || candidates.length === 0) {
            throw {
                code: ErrorCode.NOT_FOUND,
                message: `LearningObject with hruid ${hruid} not found.`,
            } as ApiError;
        }

        // Map learningObjects to their language
        return candidates.map(o => o.language);
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
        const now = Date.now();
        const shouldUpdateCache = now - this.cacheTimestamp > this.CACHE_TTL;

        // async refresh without await, make sure first user filling cache doesn't have to wait on the whole cache
        if (shouldUpdateCache) {
            this.refreshMetaDataCache(); 
        }

        // If there is no outdated cache that we can use, first ever request
        if (!this.metaDataCache) {
            const url = `${this.host}/api/${this.learningType}/search?hruid=${hruid}&language=${language}&version=${version}`;
            const fallbackCandidates: LearningObjectData[] = await this.fallback(url, hruid);
            // Extra check
            const match = fallbackCandidates.find(
                lo => lo.language === language && lo.version === version && lo.hruid == hruid
            );
            if (!match) {
                throw {
                    code: ErrorCode.NOT_FOUND,
                    message: `LearningObject ${hruid} (${language}, v${version}) not found.`,
                } as ApiError;
            }

            return LearningObject.fromObject(match);
        }

        const candidates = this.metaDataCache.get(hruid);
        if (!candidates) {
            throw {
                code: ErrorCode.NOT_FOUND,
                message: `LearningObject with hruid ${hruid} not found.`,
            } as ApiError;
        }

        const match = candidates.find(lo => lo.language === language && lo.version === version);
        if (!match) {
            throw {
                code: ErrorCode.NOT_FOUND,
                message: `LearningObject ${hruid} (${language}, v${version}) not found in cache.`,
            } as ApiError;
        }

        return match;
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
