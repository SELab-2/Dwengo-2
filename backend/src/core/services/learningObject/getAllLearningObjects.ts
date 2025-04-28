import { z } from "zod";
import { getAllLearningObjectsSchema, learningObjectSearchParams } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { ILearningObjectRepository } from "../../repositories/learningObjectRepositoryInterface";

export type GetAllLearningObjectsInput = z.infer<typeof getAllLearningObjectsSchema>;

/**
 * Class that implements the service to get all learningObjects from the Dwengo API
 * with optional filters
 */
export class GetAllLearningObjects implements Service<GetAllLearningObjectsInput> {
    constructor(private _learningObjectRepository: ILearningObjectRepository) {}

    /**
     * Function that gets all learningObjects (metadata) from the Dwengo API with optional filters
     *
     * @param input containing the input following the defined zod schema.
     * @returns an object containing an array of (metadata of) learningObjects
     */
    async execute(input: GetAllLearningObjectsInput): Promise<object> {
        const params: string[] = [];
        for (const key of learningObjectSearchParams) {
            // Convert the camelCase param to snake_case for Dwengo API
            let dwengoKey: string = key;
            // Skip the searchTerm key, as it is used in camelCase in the API
            if (key !== "searchTerm") {
                dwengoKey = key.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);
            }
            
            // Add key-value pair to params
            const val = input[key as keyof GetAllLearningObjectsInput];
            if (val !== undefined && val !== null) {
                params.push(`${dwengoKey}=${val}`);
            }
        }
        // Create the params for the request
        const paramsString: string = `${params.length !== 0 ? "?" : ""}${params.join("&")}`;

        // Return all learningObjects found as metadata objects
        return {
            learningObjects: (await this._learningObjectRepository.getLearningObjects(paramsString)).map(o =>
                o.toMetaData(),
            ),
        };
    }
}
