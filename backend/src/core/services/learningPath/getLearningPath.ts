import { z } from "zod";
import { getLearningPathSchema } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { LearningPath } from "../../entities/learningPath";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";

export type GetLearningPathInput = z.infer<typeof getLearningPathSchema>;

/**
 * Class that implements the service to get a learningObject from the Dwengo API
 */
export class GetLearningPath implements Service<GetLearningPathInput> {
    constructor(private _learningPathRepository: ILearningPathRepository) {}

    /**
     * Function that gets a learningPath from the Dwengo API
     *
     * @param input containing the input following the defined zod schema.
     * @returns an object containing the path.
     */
    async execute(_userId: string, input: GetLearningPathInput): Promise<object> {
        // When inclusion of nodes is not specified, default to false
        const includeNodes = input.includeNodes ?? false;
        // Get the available languages of this path
        const languages: string[] = await this._learningPathRepository.getLanguages(input.id);

        // Try preffered language otherwise fall back to English and if that doesn't work fall back to first in array (should be dutch)
        let language: string = input.language ?? "en";
        if (!languages.find((l: string) => l === language)) {
            // Fall back to English (only fall back when English wasn't already the language)
            if (language !== "en" && languages.find((l: string) => l === "en")) {
                language = "en";
            } else {
                language = languages[0];
            }
        }

        const path: LearningPath = await this._learningPathRepository.getLearningPath(input.id, includeNodes, language);
        return path.toObject(includeNodes);
    }
}
