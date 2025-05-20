import { z } from "zod";
import { JoinCodeService } from "./joinCodeService";
import { deleteJoinCodeSchema } from "../../../application/schemas";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type DeleteJoinCodeInput = z.infer<typeof deleteJoinCodeSchema>;

export class DeleteJoinCode extends JoinCodeService<DeleteJoinCodeInput> {
    /**
     * Executes the code deletion process.
     * @param input - The input data for deleting a group, validated by deleteJoinCodeSchema.
     * @returns An empty object.
     * @throws {ApiError} If the code with the given id is not found.
     */
    async execute(userId: string, input: DeleteJoinCodeInput): Promise<object> {
        await validateUserRights(userId, UserType.TEACHER);
        await tryRepoEntityOperation(this.JoinCodeRepository.delete(input.id), "JoinCode", input.id, true);
        return {};
    }
}
