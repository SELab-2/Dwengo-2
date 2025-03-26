import { z } from "zod";
import { JoinRequestService } from "./joinRequestService";
import { acceptJoinRequestSchema } from "../../../application/schemas";
import { JoinRequest } from "../../entities/joinRequest";
import { IClassRepository } from "../../repositories/classRepositoryInterface";
import { IJoinRequestRepository } from "../../repositories/joinRequestRepositoryInterface";

/**
 * Parameters required to accept a join request.
 */
export type AcceptJoinRequestInput = z.infer<typeof acceptJoinRequestSchema>;

/**
 * @description Service to accept a join request.
 */
export class AcceptJoinRequest extends JoinRequestService<AcceptJoinRequestInput> {
    constructor(
        private _joinRequestRepository: IJoinRequestRepository,
        private _classRepository: IClassRepository,
    ) {
        super(_joinRequestRepository);
    }

    async execute(input: AcceptJoinRequestInput): Promise<object> {
        // Get the info of the join request
        const joinRequest: JoinRequest = await this.joinRequestRepository.getJoinRequestById(input.requestId);

        // Add the user to the class
        await this._classRepository.addUserToClass(joinRequest.classId, joinRequest.requester, joinRequest.type);

        // Delete joinRequest after successfully adding user to class
        await this.joinRequestRepository.deleteJoinRequestById(input.requestId);
        return {};
    }
}
