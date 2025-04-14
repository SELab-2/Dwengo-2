import { z } from "zod";
import { getAllLearningPathsSchema, learningPathSearchParams } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";

export type GetAllLearningPathsInput = z.infer<typeof getAllLearningPathsSchema>;

/**
 * Class that implements the service to get all learningPaths from the Dwengo API
 * with optional filters
 */
export class GetAllLearningPaths implements Service<GetAllLearningPathsInput> {
    constructor(private _learningPathRepository: ILearningPathRepository) {}

    /**
     * Function that gets all learningObjects (metadata) from the Dwengo API with optional filters
     *
     * @param input containing the input following the defined zod schema.
     * @returns an object containing an array of (metadata of) learningObjects
     */
    async execute(input: GetAllLearningPathsInput): Promise<object> {
        const params: string[] = [];
        for (const key of learningPathSearchParams) {
            // Add key-value pair to params
            const val = input[key as keyof GetAllLearningPathsInput];
            if (val !== undefined && val !== null) {
                params.push(`${key}=${val}`);
            }
        }
        // Create the params for the request
        const paramsString: string = `${params.length !== 0 ? "?" : ""}${params.join("&")}`;

        return {
            learningPaths: (await this._learningPathRepository.getLearningPaths(paramsString)).map(p => p.toObject()),
        };
    }
}
