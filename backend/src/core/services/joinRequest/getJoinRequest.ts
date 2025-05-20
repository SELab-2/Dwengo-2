import { z } from "zod";
import { JoinRequestService } from "./joinRequestService";
import {
    getJoinRequestSchema,
    getUserJoinRequestsSchema,
    getClassJoinRequestsSchema,
} from "../../../application/schemas";
import { JoinRequest } from "../../entities/joinRequest";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

/**
 * @description paramaters to get all joinRequests of a class
 *
 * @param _classId The id of the class.
 */
export type GetClassJoinRequestsInput = z.infer<typeof getClassJoinRequestsSchema>;

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
 * @description class representing service to get all joinRequests of a class
 *
 */
export class GetClassJoinRequests extends JoinRequestService<GetClassJoinRequestsInput> {
    /**
     * Executes the class join-request get process.
     * @param input - The input data for getting class join-request, validated by getClassJoinCodesSchema.
     * @returns A promise resolving to an object with a list of join-request.
     * @throws {ApiError} If the class with the given id is not found.
     */
    async execute(userId: string, input: GetClassJoinRequestsInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, UserType.TEACHER, undefined);
        // Get all requests for user
        const requests: JoinRequest[] = await tryRepoEntityOperation(
            this.joinRequestRepository.getByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        return { requests: requests.map(request => request.id) };
    }
}

/**
 * @description class representing service to get all joinRequests of a user
 *
 */
export class GetUserJoinRequests extends JoinRequestService<GetUserJoinRequestsInput> {
    /**
     * Executes the user join-request get process.
     * @param input - The input data for getting user join-request, validated by getUserJoinRequestsSchema.
     * @returns A promise resolving to an object with a list of join-request.
     * @throws {ApiError} If the user with the given id is not found.
     */
    async execute(userId: string, input: GetUserJoinRequestsInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, undefined, input.idParent);
        // Get all requests for user
        const requests: JoinRequest[] = await tryRepoEntityOperation(
            this.joinRequestRepository.getByRequesterId(input.idParent),
            "User",
            input.idParent,
            true,
        );
        return { requests: requests.map(request => request.id) };
    }
}

/**
 * @description class representing service to get a single joinRequest
 */
export class GetJoinRequest extends JoinRequestService<GetJoinRequestInput> {
    /**
     * Executes the join-request get process.
     * @param input - The input data for getting a join-request, validated by getJoinRequestSchema.
     * @returns A promise resolving to a join-request transformed into an object.
     * @throws {ApiError} If the join-request with the given id was not found.
     */
    async execute(_userId: string, input: GetJoinRequestInput): Promise<object> {
        return (
            await tryRepoEntityOperation(this.joinRequestRepository.getById(input.id), "JoinRequest", input.id, true)
        ).toObject();
    }
}
