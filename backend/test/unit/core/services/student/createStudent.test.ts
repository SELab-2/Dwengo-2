import { ErrorCode } from "../../../../../src/application/types";
import { UserType } from "../../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../../src/core/repositories/teacherRepositoryInterface";
import { CreateUser } from "../../../../../src/core/services/user/createUser";

const mockStudentRepository = {
    checkByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
    create: jest.fn().mockResolvedValue("mock-user-id"), // Simulate user
} as unknown as jest.Mocked<IStudentRepository>;

const mockTeacherRepository = {
    checkByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
} as unknown as jest.Mocked<ITeacherRepository>;

describe("CreateStudent", () => {
    let createStudent: CreateUser;

    beforeEach(() => {
        createStudent = new CreateUser(mockStudentRepository as any, mockTeacherRepository as any);
    });

    test("Should throw error because of invalid email", async () => {
        await expect(
            createStudent.execute({
                email: "incorrect-email",
                firstName: "John",
                familyName: "Doe",
                passwordHash: "hashedpassword123",
                schoolName: "Harvard",
                userType: UserType.STUDENT,
            }),
        ).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Email invalid.",
        });
    });

    test("Should throw error if email is already in use by student", async () => {
        mockStudentRepository.checkByEmail.mockResolvedValue(true);
        const params = {
            email: "test@example.com",
            firstName: "John",
            familyName: "Doe",
            passwordHash: "hashedpassword123",
            schoolName: "Oxford",
            userType: UserType.STUDENT,
        };
        await expect(createStudent.execute(params)).rejects.toEqual({
            code: ErrorCode.CONFLICT,
            message: "Email already in use.",
        });

        // Control if checkByEmail is correctly called
        expect(mockStudentRepository.checkByEmail).toHaveBeenCalledWith("test@example.com");
    });

    test("Should throw error if email is already in use by teacher", async () => {
        mockTeacherRepository.checkByEmail.mockResolvedValue(true);
        const params = {
            email: "test@example.com",
            firstName: "John",
            familyName: "Doe",
            passwordHash: "hashedpassword123",
            schoolName: "Oxford",
            userType: UserType.STUDENT,
        };
        await expect(createStudent.execute(params)).rejects.toEqual({
            code: ErrorCode.CONFLICT,
            message: "Email already in use.",
        });

        // Control if checkByEmail is correctly called
        expect(mockStudentRepository.checkByEmail).toHaveBeenCalledWith("test@example.com");
    });
});
