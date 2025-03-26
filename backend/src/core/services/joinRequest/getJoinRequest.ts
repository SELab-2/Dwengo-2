import { z } from "zod";
import { ApiError, ErrorCode } from "../../../application/types";
import { JoinRequest } from "../../entities/joinRequest";
import { getJoinRequestSchema, getUserJoinRequestsSchema } from "../../../application/schemas";
import { JoinRequestService } from "./joinRequestService"; // Adjust the path as needed

/**
 * @description paramaters to get all joinRequests of a user
 *
 * @param _userId The id of the user.
 */
export type GetUserJoinRequestsInput = z.infer<typeof getUserJoinRequestsSchema>;

/**
 * @description paramaters to get a single joinRequest of a user
 * @param _userId The id of the user.
 * @param _requestId The id of the joinRequest.
 */
export type GetJoinRequestInput = z.infer<typeof getJoinRequestSchema>;

/**
 * @description class representing service to get all joinRequests of a user
 *
 */
export class GetUserJoinRequests extends JoinRequestService<GetUserJoinRequestsInput> {
    async execute(input: GetUserJoinRequestsInput): Promise<object> {
        // Get all requests for user
        const requests: JoinRequest[] = await this.joinRequestRepository.getJoinRequestByRequesterId(input.userId);
        return {
            requests: requests.map(request => request.toObject()),
        };
    }
}

/**
 * @description class representing service to get a single joinRequest of a user
 */
export class GetJoinRequest extends JoinRequestService<GetJoinRequestInput> {
    async execute(input: GetJoinRequestInput): Promise<object> {
        console.log(input.requestId, input.userId);
        // Get all requests
        const requests: JoinRequest[] = await this.joinRequestRepository.getJoinRequestByRequesterId(input.userId);

        // Search for request with id
        const joinRequest: JoinRequest[] = requests.filter(request => request.id === input.requestId);

        // No request found for this user with the given id.
        if (joinRequest.length === 0) {
            throw {
                code: ErrorCode.NOT_FOUND,
                message: "joinRequest not found.",
            } as ApiError;
        }
        return { request: joinRequest[0].toObject() };
    }
}
