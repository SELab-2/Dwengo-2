import { z } from "zod";
import { getObjectSchema } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { ILearningObjectRepository } from "../../repositories/LearningObjectRepositoryInterface";
import { HTMLType, LearningObject } from "../../entities/LearningObject";

export type GetObjectInput = z.infer<typeof getObjectSchema>;

export class GetObject implements Service<GetObjectInput> {
    constructor(
        private _learningObjectRepository: ILearningObjectRepository
    ) {}

    async execute(input: GetObjectInput): Promise<object> {
        let learningObject: LearningObject;
        if (input.type === HTMLType.WRAPPED) {
            learningObject = await this._learningObjectRepository.getwrappedLearningObject(input.id, input.language ?? "nl", input.version ?? 1);
        } else {
            learningObject = await this._learningObjectRepository.getrawLearningObject(input.id, input.language ?? "nl", input.version ?? 1);
        }
        return learningObject.toObject(true)
    }
}
