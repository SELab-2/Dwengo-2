import { z } from "zod";
import { JoinCodeService } from "./joinCodeService";
import { createJoinCodeSchema } from "../../../application/schemas";
import { JoinCode } from "../../entities/joinCode";
import { tryRepoEntityOperation } from "../../helpers";
import { IJoinCodeRepository } from "../../repositories/joinCodeRepositoryInterface";

export type CreateJoinCodeInput = z.infer<typeof createJoinCodeSchema>;

export class CreateJoinCode extends JoinCodeService<CreateJoinCodeInput> {
    constructor(_JoinCodeRepository: IJoinCodeRepository) {
        super(_JoinCodeRepository);
    }

    /**
     * Executes the join-code creation process.
     * @param input - The input data for creating a join-code, validated by createJoinCodeSchema.
     * @returns A promise resolving to an object containing the code of the created join-code.
     * @throws {ApiError} If the class with the given id is not found or if the creation fails.
     */
    async execute(input: CreateJoinCodeInput): Promise<object> {
        const joinCode: JoinCode = await tryRepoEntityOperation(
            this.JoinCodeRepository.create(new JoinCode(input.classId, undefined, undefined, false)),
            "Class",
            `${input.classId}`,
        );
        return { id: joinCode.code };
    }
}
