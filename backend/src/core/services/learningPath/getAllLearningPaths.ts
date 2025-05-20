import { z } from "zod";
import { getAllLearningPathsSchema, learningPathSearchParams } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { LearningPath } from "../../entities/learningPath";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";

export type GetAllLearningPathsInput = z.infer<typeof getAllLearningPathsSchema>;

/**
 * Class that implements the service to get all learningPaths from the Dwengo API
 * with optional filters
 */
export class GetAllLearningPaths implements Service<GetAllLearningPathsInput> {
    constructor(private _learningPathRepository: ILearningPathRepository) {}

    /**
     * Function that gets all learningPaths from the Dwengo API with optional filters
     *
     * @param input containing the input following the defined zod schema.
     * @returns an object containing an array of learningPaths
     */
    async execute(_userId: string, input: GetAllLearningPathsInput): Promise<object> {
        // When inclusion of nodes is not specified, default to false
        const includeNodes = input.includeNodes ?? false;
        const params: string[] = [];
        for (const key of learningPathSearchParams) {
            // Add key-value pair to params
            const val = input[key as keyof GetAllLearningPathsInput];
            if (val !== undefined && val !== null) {
                params.push(`${key}=${val}`);
            }
        }
        const learningPaths: LearningPath[] = [];
        // Get all the learningObjects for each word in all if it exists
        if (input.all !== undefined) {
            const allParams: string[] =
                input.all.length === 0 ? [""] : input.all.split("-").filter((val: string) => val.length > 0);
            for (const allParam of allParams) {
                const paramsString: string = `?all=${allParam}${params.length > 0 ? "&" : ""}${params.join("&")}`;
                learningPaths.push(
                    ...(await this._learningPathRepository.getLearningPaths(paramsString, includeNodes)),
                );
            }
        } else {
            const paramsString: string = `${params.length > 0 ? "?" : ""}${params.join("&")}`;
            learningPaths.push(...(await this._learningPathRepository.getLearningPaths(paramsString, includeNodes)));
        }

        return {
            learningPaths: learningPaths.map((p: LearningPath) => p.toObject(includeNodes)),
        };
    }
}
