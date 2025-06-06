import { z } from "zod";
import { JoinRequestService } from "./joinRequestService";
import { acceptJoinRequestSchema } from "../../../application/schemas";
import { JoinRequest } from "../../entities/joinRequest";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";
import { IClassRepository } from "../../repositories/classRepositoryInterface";
import { IJoinRequestRepository } from "../../repositories/joinRequestRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

/**
 * Parameters required to accept a join request.
 */
export type AcceptJoinRequestInput = z.infer<typeof acceptJoinRequestSchema>;

/**
 * @description Service to accept a join request.
 */
export class AcceptJoinRequest extends JoinRequestService<AcceptJoinRequestInput> {
    constructor(
        _joinRequestRepository: IJoinRequestRepository,
        _userRepository: IUserRepository,
        private _classRepository: IClassRepository,
    ) {
        super(_joinRequestRepository, _userRepository);
    }

    /**
     * Executes the accept join-request process.
     * @param input - The input data for accepting a join-request, validated by acceptJoinRequestSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the join-request with the given id is not found.
     */
    async execute(userId: string, input: AcceptJoinRequestInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, UserType.TEACHER, undefined);
        // Get the info of the join request
        const joinRequest: JoinRequest = await tryRepoEntityOperation(
            this.joinRequestRepository.getById(input.id),
            "JoinRequest",
            input.id,
            true,
        );

        // Add the user to the class
        await tryRepoEntityOperation(
            this._classRepository.addUserToClass(joinRequest.classId, joinRequest.requester),
            "Class | User",
            `${joinRequest.classId} | ${joinRequest.requester}`,
            true,
        );

        // Delete joinRequest after successfully adding user to class
        await tryRepoEntityOperation(this.joinRequestRepository.delete(input.id), "JoinRequest", input.id, true);
        return {};
    }
}
