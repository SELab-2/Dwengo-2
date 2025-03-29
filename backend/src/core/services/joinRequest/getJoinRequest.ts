import { z } from "zod";
import { JoinRequestService } from "./joinRequestService"; // Adjust the path as needed
import { getJoinRequestSchema, getUserJoinRequestsSchema } from "../../../application/schemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { JoinRequest } from "../../entities/joinRequest";

/**
 * @description paramaters to get all joinRequests of a user
 *
 * @param _userId The id of the user.
 */
export type GetUserJoinRequestsInput = z.infer<typeof getUserJoinRequestsSchema>;

/**
 * @description paramaters to get a single joinRequest
 * @param id The id of the joinRequest.
 */
export type GetJoinRequestInput = z.infer<typeof getJoinRequestSchema>;

/**
 * @description class representing service to get all joinRequests of a user
 *
 */
export class GetUserJoinRequests extends JoinRequestService<GetUserJoinRequestsInput> {
    async execute(input: GetUserJoinRequestsInput): Promise<object> {
        // Get all requests for user
        const requests: JoinRequest[] = await this.joinRequestRepository.getJoinRequestByRequesterId(input.idParent);
        return {
            requests: requests.map(request => request.id),
        };
    }
}

/**
 * @description class representing service to get a single joinRequest
 */
export class GetJoinRequest extends JoinRequestService<GetJoinRequestInput> {
    async execute(input: GetJoinRequestInput): Promise<object> {
        // Get request
        const request: JoinRequest = await this.joinRequestRepository.getJoinRequestById(input.id);

        // No request found for this user with the given id.
        if (!request) {
            throw {
                code: ErrorCode.NOT_FOUND,
                message: "joinRequest not found.",
            } as ApiError;
        }
        return request.toObject();
    }
}
