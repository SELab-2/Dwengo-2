import { ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { IJoinRequestRepository } from "../../../../../src/core/repositories/joinRequestRepositoryInterface";
import { DeleteJoinRequest, DeleteJoinRequestInput } from "../../../../../src/core/services/joinRequest/deleteJoinRequest";
import * as RightsValidator from "../../../../../src/core/helpers";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

describe("DeleteJoinRequest Service", () => {
    let deleteJoinRequestService: DeleteJoinRequest;
    let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
    let input: DeleteJoinRequestInput;

    beforeEach(() => {
        mockJoinRequestRepository = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<IJoinRequestRepository>;

        const mockUserRepository = {
            getById: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        deleteJoinRequestService = new DeleteJoinRequest(mockJoinRequestRepository, mockUserRepository);

        input = {
            id: "1",
        };
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should throw error if join request not found in database", async () => {
        mockJoinRequestRepository.delete.mockRejectedValue(new EntityNotFoundError("Join request not found"));

        await expect(deleteJoinRequestService.execute("", input)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
    });

    test("Should return empty object if join request is deleted", async () => {
        mockJoinRequestRepository.delete.mockResolvedValue(undefined);

        await expect(deleteJoinRequestService.execute("", input)).resolves.toEqual({});
        expect(mockJoinRequestRepository.delete).toHaveBeenCalledWith(input.id);
    });
});
