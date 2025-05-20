import { DatabaseError } from "../../../../../src/config/error";
import { JoinCode } from "../../../../../src/core/entities/joinCode";
import {
    GetJoinCode,
    GetJoinCodeInput,
    GetClassJoinCodes,
    GetClassJoinCodesInput,
} from "../../../../../src/core/services/joinCode/getJoinCodes";

// Mock repository
const mockJoinCodeRepository = {
    getById: jest.fn(),
    getByClassId: jest.fn(),
};

describe("GetJoinCode", () => {
    let getJoinCode: GetJoinCode;
    let input: GetJoinCodeInput;

    beforeEach(() => {
        getJoinCode = new GetJoinCode(mockJoinCodeRepository as any);
        jest.clearAllMocks();
        input = {
            id: "joincode-123",
        };
    });

    test("Should retrieve a join-code by ID and return it as an object", async () => {
        const joinCode = new JoinCode("class-456", new Date("2025-03-11T12:00:00Z"), "joinCode-123", false);

        mockJoinCodeRepository.getById.mockResolvedValue(joinCode);

        const result = await getJoinCode.execute("", input);

        expect(result).toEqual(joinCode.toObject());
        expect(mockJoinCodeRepository.getById).toHaveBeenCalledWith("joincode-123");
    });

    test("Should throw a DatabaseError if retrieval fails", async () => {
        mockJoinCodeRepository.getById.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(getJoinCode.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockJoinCodeRepository.getById).toHaveBeenCalledWith("joincode-123");
    });
});

describe("GetClassJoinCodes", () => {
    let getClassJoinCodes: GetClassJoinCodes;
    let input: GetClassJoinCodesInput;

    beforeEach(() => {
        getClassJoinCodes = new GetClassJoinCodes(mockJoinCodeRepository as any);
        jest.clearAllMocks();
        input = {
            idParent: "class-456",
        };
    });

    test("Should retrieve all join codes for a class and return their codes", async () => {
        const joinCode1 = new JoinCode("class-456", new Date("2025-03-11T12:00:00Z"), "joinCode-123", false);
        const joinCode2 = new JoinCode("class-456", new Date("2025-03-12T12:00:00Z"), "joinCode-124", false);
        mockJoinCodeRepository.getByClassId.mockResolvedValue([joinCode1, joinCode2]);

        const result = await getClassJoinCodes.execute('', input);

        expect(result).toEqual({ codes: ["joinCode-123", "joinCode-124"] });
        expect(mockJoinCodeRepository.getByClassId).toHaveBeenCalledWith("class-456");
    });

    test("Should return an empty codes array if no join codes are found", async () => {
        mockJoinCodeRepository.getByClassId.mockResolvedValue([]);

        const result = await getClassJoinCodes.execute("", input);

        expect(result).toEqual({ codes: [] });
        expect(mockJoinCodeRepository.getByClassId).toHaveBeenCalledWith("class-456");
    });

    test("Should throw a DatabaseError if retrieval fails", async () => {
        mockJoinCodeRepository.getByClassId.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(getClassJoinCodes.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockJoinCodeRepository.getByClassId).toHaveBeenCalledWith("class-456");
    });
});
