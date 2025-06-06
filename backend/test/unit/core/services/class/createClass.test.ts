import { DatabaseError } from "../../../../../src/config/error";
import { Class } from "../../../../../src/core/entities/class";
import { CreateClass } from "../../../../../src/core/services/class/createClass";
import * as RightsValidator from "../../../../../src/core/helpers";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repository
const mockClassRepository = {
    create: jest.fn(),
};

const mockUserRepository = {
    getById: jest.fn(),
} as unknown as jest.Mocked<IUserRepository>;

describe("CreateClass", () => {
    let createClass: CreateClass;
    const inputClass = {
        name: "Math 101",
        description: "Basic math class",
        targetAudience: "Primary School",
        teacherId: "teacher_id",
    };

    beforeEach(() => {
        createClass = new CreateClass(mockClassRepository as any, mockUserRepository);
        jest.clearAllMocks(); // Reset mocks voor elke test
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should create a class and return its ID", async () => {
        const createdClass = new Class("Math 101", "Basic math class", "Primary School", "teacher-id", "mock-class-id");

        mockClassRepository.create.mockResolvedValue(createdClass);

        const result = await createClass.execute("", inputClass);

        expect(result).toEqual({ id: "mock-class-id" });
        expect(mockClassRepository.create).toHaveBeenCalledWith(expect.any(Class));
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        mockClassRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(createClass.execute("", inputClass)).rejects.toThrow(DatabaseError);
        expect(mockClassRepository.create).toHaveBeenCalledWith(expect.any(Class));
    });
});
