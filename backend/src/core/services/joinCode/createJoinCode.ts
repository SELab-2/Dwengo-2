import { z } from "zod";
import { JoinCodeService } from "./joinCodeService";
import { createJoinCodeSchema } from "../../../application/schemas";
import { ApiError, ErrorCode } from "../../../application/types";
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
        const activeCodes: JoinCode[] = await tryRepoEntityOperation(
            this.JoinCodeRepository.getByClassId(input.classId),
            "Class",
            `${input.classId}`,
        );

        if (activeCodes.length > 0) {
            throw {
                code: ErrorCode.CONFLICT,
                message: `An active join code (${activeCodes[0].code}) already exists for class ${input.classId}`,
            } as ApiError;
        }

        const JoinCode: JoinCode = await tryRepoEntityOperation(
            this.JoinCodeRepository.create(input.classId),
            "Class",
            `${input.classId}`,
        );
        return { id: JoinCode.code };
    }
}
