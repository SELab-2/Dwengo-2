import { DatabaseError } from "../../../../../src/config/error";
import { DeleteJoinCode, DeleteJoinCodeInput } from "../../../../../src/core/services/joinCode/deleteJoinCode";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repository
const mockJoinCodeRepository = {
    delete: jest.fn(),
};

describe("DeleteJoinCode", () => {
    let deleteJoinCode: DeleteJoinCode;
    let input: DeleteJoinCodeInput;

    beforeEach(() => {
        deleteJoinCode = new DeleteJoinCode(mockJoinCodeRepository as any);
        jest.clearAllMocks();
        input = {
            id: "joincode-123",
        };
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should delete a join-code successfully", async () => {
        mockJoinCodeRepository.delete.mockResolvedValue(undefined);

        const result = await deleteJoinCode.execute("", input);

        expect(result).toEqual({});
        expect(mockJoinCodeRepository.delete).toHaveBeenCalledWith("joincode-123");
    });

    test("Should throw a DatabaseError if deletion fails", async () => {
        mockJoinCodeRepository.delete.mockRejectedValue(new DatabaseError("Deletion failed"));

        await expect(deleteJoinCode.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockJoinCodeRepository.delete).toHaveBeenCalledWith("joincode-123");
    });
});
