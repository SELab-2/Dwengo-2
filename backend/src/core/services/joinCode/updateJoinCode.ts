import { z } from "zod";
import { JoinCodeService } from "./joinCodeService";
import { updateJoinCodeSchema } from "../../../application/schemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { tryRepoEntityOperation } from "../../helpers";

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
    async execute(input: UpdateJoinCodeInput): Promise<object> {
        if (input.expired) {
            await tryRepoEntityOperation(this.JoinCodeRepository.setExpired(input.id), "JoinCode", input.id, true);
        }
        return {};
    }
}
