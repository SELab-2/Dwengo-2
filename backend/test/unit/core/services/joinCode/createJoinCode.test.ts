import { DatabaseError } from "../../../../../src/config/error";
import { JoinCode } from "../../../../../src/core/entities/joinCode";
import { CreateJoinCode, CreateJoinCodeInput } from "../../../../../src/core/services/joinCode/createJoinCode";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repository
const mockJoinCodeRepository = {
    create: jest.fn(),
};

describe("createJoinCode", () => {
    let createJoinCode: CreateJoinCode;
    let input: CreateJoinCodeInput;

    beforeEach(() => {
        createJoinCode = new CreateJoinCode(mockJoinCodeRepository as any);
        jest.clearAllMocks();
        input = {
            classId: "class-123",
        };
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should create a join-code and return it with an ID", async () => {
        mockJoinCodeRepository.create.mockResolvedValue(new JoinCode("class-123", undefined, "joincode-999", false));

        const result = await createJoinCode.execute("", input);

        expect(result).toEqual({ id: "joincode-999" });
        expect(mockJoinCodeRepository.create).toHaveBeenCalledWith(expect.any(JoinCode));
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        mockJoinCodeRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(createJoinCode.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockJoinCodeRepository.create).toHaveBeenCalledWith(expect.any(JoinCode));
    });
});
