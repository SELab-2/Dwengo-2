import { z } from "zod";
import { getLearningObjectSchema } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { HTMLType, LearningObject } from "../../entities/learningObject";
import { ILearningObjectRepository } from "../../repositories/learningObjectRepositoryInterface";

export type GetObjectInput = z.infer<typeof getLearningObjectSchema>;

/**
 * Class that implements the service to get a learningObject from the Dwengo API
 */
export class GetLearningObject implements Service<GetObjectInput> {
    constructor(private _learningObjectRepository: ILearningObjectRepository) {}

    /**
     * Function that gets a learningObject from the Dwengo API
     *
     * @param input containing the input following the defined zod schema.
     * @returns an object containing the metadata + raw/wrapped html-content
     */
    async execute(_userId: string, input: GetObjectInput): Promise<object> {
        // Get the versions and available languages of this object
        const versions: string[] = await this._learningObjectRepository.getVersions(input.id);
        const languages: string[] = await this._learningObjectRepository.getLanguages(input.id);

        // Get latest version
        let version: number = Math.max(...versions.map(v => parseInt(v, 10)));
        if (input.version && versions.find((v: string) => v === input.version)) {
            // If specific version is requested and exists use this one
            version = parseInt(input.version);
        }

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

        let learningObject: LearningObject;
        if (input.type === HTMLType.WRAPPED) {
            // Get the wrapped learningObject + metadata
            learningObject = await this._learningObjectRepository.getWrappedLearningObject(input.id, language, version);
        } else {
            // Get the raw learningObject + metadata
            learningObject = await this._learningObjectRepository.getRawLearningObject(input.id, language, version);
        }

        // Return the learningObject with html-content included
        return learningObject.toObject();
    }
}
