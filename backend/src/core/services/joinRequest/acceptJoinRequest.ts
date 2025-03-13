import { Service, ServiceParams } from "../../../config/service";
import { JoinRequest } from "../../entities/joinRequest";
import { IClassRepository } from "../../repositories/classRepositoryInterface";
import { IJoinRequestRepository } from "../../repositories/joinRequestRepositoryInterface";

/**
 * Parameters required to accept a join request.
 */
export class AcceptJoinRequestParams implements ServiceParams {
    constructor(private _requestId: string) {}

    public get requestId(): string {
        return this._requestId;
    }
}
/**
 * @description Service to accept a join request.
 */
export class AcceptJoinRequest implements Service<AcceptJoinRequestParams> {
    constructor(
        private _joinRequestRepository: IJoinRequestRepository,
        private _classRepository: IClassRepository,
    ) {}

    async execute(input: AcceptJoinRequestParams): Promise<object> {
        // Get the info of the join request
        const joinRequest: JoinRequest = await this._joinRequestRepository.getJoinRequestById(input.requestId);

        // Add the user to the class
        await this._classRepository.addUserToClass(joinRequest.classId, joinRequest.requester, joinRequest.type);

        // Delete joinRequest after successfully adding user to class
        await this._joinRequestRepository.deleteJoinRequestById(input.requestId);
        return {};
    }
}
