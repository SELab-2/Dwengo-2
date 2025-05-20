import { z } from "zod";
import { JoinCodeService } from "./joinCodeService";
import { getJoinCodeSchema, getClassJoinCodesSchema } from "../../../application/schemas";
import { JoinCode } from "../../entities/joinCode";
import { tryRepoEntityOperation } from "../../helpers";

/**
 * @description paramaters to get all JoinCodes of a user
 *
 * @param _userId The id of the user.
 */
export type GetClassJoinCodesInput = z.infer<typeof getClassJoinCodesSchema>;

/**
 * @description paramaters to get a single JoinCode
 * @param id The id of the JoinCode.
 */
export type GetJoinCodeInput = z.infer<typeof getJoinCodeSchema>;

/**
 * @description class representing service to get all JoinCodes of a user
 *
 */
export class GetClassJoinCodes extends JoinCodeService<GetClassJoinCodesInput> {
    /**
     * Executes the user join-code get process.
     * @param input - The input data for getting user join-code, validated by getClassJoinCodesSchema.
     * @returns A promise resolving to an object with a list of join-code.
     * @throws {ApiError} If the class with the given id is not found.
     */
    async execute(_userId: string, input: GetClassJoinCodesInput): Promise<object> {
        // Get all requests for user
        const requests: JoinCode[] = await tryRepoEntityOperation(
            this.JoinCodeRepository.getByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        return { codes: requests.map(request => request.code) };
    }
}

/**
 * @description class representing service to get a single JoinCode
 */
export class GetJoinCode extends JoinCodeService<GetJoinCodeInput> {
    /**
     * Executes the join-code get process.
     * @param input - The input data for getting a join-code, validated by getJoinCodeSchema.
     * @returns A promise resolving to a join-request transformed into an object.
     * @throws {ApiError} If the join-code with the given id was not found.
     */
    async execute(_userId: string, input: GetJoinCodeInput): Promise<object> {
        return (
            await tryRepoEntityOperation(this.JoinCodeRepository.getById(input.id), "JoinCode", input.id, true)
        ).toObject();
    }
}
