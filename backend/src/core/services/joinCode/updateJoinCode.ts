import { z } from "zod";
import { JoinCodeService } from "./joinCodeService";
import { updateJoinCodeSchema } from "../../../application/schemas";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type UpdateJoinCodeInput = z.infer<typeof updateJoinCodeSchema>;

/**
 * Service that updates an JoinCode.
 */
export class UpdateJoinCode extends JoinCodeService<UpdateJoinCodeInput> {
    /**
     * Executes the JoinCode update process.
     * @param input - The input data for updating an JoinCode, validated by UpdateJoinCodeInput.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the JoinCode with the given id is not found.
     */
    async execute(userId: string, input: UpdateJoinCodeInput): Promise<object> {
        await validateUserRights(userId, UserType.TEACHER);
        const joinCode = await tryRepoEntityOperation(
            this.JoinCodeRepository.getById(input.id),
            "JoinCode",
            input.id,
            true,
        );
        if (input.expired) {
            joinCode.isExpired = input.expired;
            await tryRepoEntityOperation(this.JoinCodeRepository.update(joinCode), "JoinCode", input.id, true);
        }
        return {};
    }
}
