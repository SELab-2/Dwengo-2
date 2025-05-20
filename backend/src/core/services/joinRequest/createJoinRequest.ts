import { z } from "zod";
import { JoinRequestService } from "./joinRequestService";
import { createJoinRequestSchema } from "../../../application/schemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { JoinRequest } from "../../entities/joinRequest";
import { tryRepoEntityOperation } from "../../helpers";
import { IClassRepository } from "../../repositories/classRepositoryInterface";
import { IJoinRequestRepository } from "../../repositories/joinRequestRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type CreateJoinRequestInput = z.infer<typeof createJoinRequestSchema>;

export class CreateJoinRequest extends JoinRequestService<CreateJoinRequestInput> {
    constructor(
        _joinRequestRepository: IJoinRequestRepository,
        _userRepository: IUserRepository,
        private _classRepository: IClassRepository,
    ) {
        super(_joinRequestRepository, _userRepository);
    }

    /**
     * Executes the join-request creation process.
     * @param input - The input data for creating a join-request, validated by createJoinRequestSchema.
     * @returns A promise resolving to an object containing the ID of the created join-request.
     * @throws {ApiError} If the join-request with the given id is not found or if the creation fails.
     */
    async execute(_userId: string, input: CreateJoinRequestInput): Promise<object> {
        const createPromise = input.class
            ? this.joinRequestRepository.create(await this.fromObject(input))
            : this.joinRequestRepository.createUsingCode(input.code!, input.requester, input.userType);
        const joinRequest: JoinRequest = await tryRepoEntityOperation(
            createPromise,
            "Class | Requester",
            `${input.class} | ${input.requester}`,
        );
        return { id: joinRequest.id };
    }

    async fromObject(input: CreateJoinRequestInput): Promise<JoinRequest> {
        // Check if user hasn't already requested to join the class
        const classRequests: JoinRequest[] = await this.joinRequestRepository.getByClassId(input.class!);
        for (const req of classRequests) {
            if (req.requester == input.requester) {
                throw {
                    code: ErrorCode.CONFLICT,
                    message: "User already has a join request for this class.",
                } as ApiError;
            }
        }

        return new JoinRequest(input.requester, input.class!, input.userType);
    }
}
