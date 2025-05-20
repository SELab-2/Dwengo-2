import { ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { JoinRequest, JoinRequestType } from "../../../../../src/core/entities/joinRequest";
import { IClassRepository } from "../../../../../src/core/repositories/classRepositoryInterface";
import { IJoinRequestRepository } from "../../../../../src/core/repositories/joinRequestRepositoryInterface";
import { AcceptJoinRequest, AcceptJoinRequestInput } from "../../../../../src/core/services/joinRequest/acceptJoinRequest";
import * as RightsValidator from "../../../../../src/core/helpers";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

describe("AcceptJoinRequest Service", () => {
    let acceptJoinRequestService: AcceptJoinRequest;
    let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
    let mockClassRepository: jest.Mocked<IClassRepository>;
    let params: AcceptJoinRequestInput;

    beforeEach(() => {
        mockJoinRequestRepository = {
            getById: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IJoinRequestRepository>;

        mockClassRepository = {
            addUserToClass: jest.fn(),
        } as unknown as jest.Mocked<IClassRepository>;

        const mockUserRepository = {
            getById: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        acceptJoinRequestService = new AcceptJoinRequest(mockJoinRequestRepository, mockUserRepository, mockClassRepository);

        params = {
            id: "1",
        };
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should throw error if join request not found", async () => {
        mockJoinRequestRepository.getById.mockRejectedValue(new EntityNotFoundError("Join request not found"));

        await expect(acceptJoinRequestService.execute("", params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
    });

    test("Should add user to class and delete join request", async () => {
        const joinRequest: JoinRequest = new JoinRequest("user1", "class1", JoinRequestType.STUDENT, "1");

        mockJoinRequestRepository.getById.mockResolvedValue(joinRequest);
        mockClassRepository.addUserToClass.mockResolvedValue(undefined);
        mockJoinRequestRepository.delete.mockResolvedValue(undefined);

        await expect(acceptJoinRequestService.execute("", params)).resolves.toEqual({});
        expect(mockJoinRequestRepository.getById).toHaveBeenCalledWith(params.id);
        expect(mockClassRepository.addUserToClass).toHaveBeenCalledWith(
            joinRequest.classId,
            joinRequest.requester
        );
        expect(mockJoinRequestRepository.delete).toHaveBeenCalledWith(params.id);
    });
});
