import { DatabaseError } from "../../../../../src/config/error";
import { JoinCode } from "../../../../../src/core/entities/joinCode";
import { UpdateJoinCode, UpdateJoinCodeInput } from "../../../../../src/core/services/joinCode/updateJoinCode";

// Mock repository
const mockJoinCodeRepository = {
    getById: jest.fn(),
    update: jest.fn(),
};

describe("UpdateJoinCode", () => {
    let updateJoinCode: UpdateJoinCode;
    let input: UpdateJoinCodeInput;

    beforeEach(() => {
        updateJoinCode = new UpdateJoinCode(mockJoinCodeRepository as any);
        jest.clearAllMocks();
        input = {
            id: "joincode-123",
            expired: true,
        };
    });

    test("Should update a join code successfully", async () => {
        const existingJoinCode = new JoinCode("class-456", new Date(), "joincode-123", false);

        mockJoinCodeRepository.getById.mockResolvedValue(existingJoinCode);
        mockJoinCodeRepository.update.mockResolvedValue(undefined);

        const result = await updateJoinCode.execute(input);

        expect(result).toEqual({});
        expect(mockJoinCodeRepository.getById).toHaveBeenCalledWith("joincode-123");
        expect(mockJoinCodeRepository.update).toHaveBeenCalledWith(expect.any(JoinCode));
        expect(existingJoinCode.isExpired).toBe(true);
    });

    test("Should throw a DatabaseError if retrieval fails", async () => {
        mockJoinCodeRepository.getById.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(updateJoinCode.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockJoinCodeRepository.getById).toHaveBeenCalledWith("joincode-123");
    });
});
