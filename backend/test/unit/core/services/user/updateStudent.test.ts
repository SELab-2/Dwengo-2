import { ErrorCode } from "../../../../../src/application/types";
import { Student } from "../../../../../src/core/entities/student";
import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { UpdateUser } from "../../../../../src/core/services/user";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

describe("UpdateStudent Service", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let updateStudent: UpdateUser;

    beforeEach(() => {
        userRepository = {
            getById: jest.fn(),
            checkByEmail: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        updateStudent = new UpdateUser(userRepository);
        mockValidateUserRights.mockResolvedValue();
    });

    it("should update student info successfully", async () => {
        const student = new Student(
            "oldemail@example.com",
            "OldFirstName",
            "OldFamilyName",
            "oldpasswordhash",
            "oldSchool",
            "1",
        );
        userRepository.getById.mockResolvedValue(student);
        userRepository.update.mockResolvedValue(student);
        userRepository.checkByEmail.mockResolvedValue(false);

        const params = {
            id: "1",
            userType: UserType.STUDENT,
            email: "newemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "newpasswordhash",
            schoolName: "newSchool",
        };

        const result = await updateStudent.execute("", params);

        expect(userRepository.getById).toHaveBeenCalledWith("1");
        expect(userRepository.checkByEmail).toHaveBeenCalledWith("newemail@example.com");
        expect(userRepository.checkByEmail).toHaveBeenCalledWith("newemail@example.com");
        expect(userRepository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "1",
                email: "newemail@example.com",
                firstName: "NewFirstName",
                familyName: "NewFamilyName",
                passwordHash: "newpasswordhash",
                schoolName: "newSchool",
            }),
        );
        expect(result).toEqual({});
    });

    it("should update one field successfully", async () => {
        const student = new Student(
            "oldemail@example.com",
            "OldFirstName",
            "OldFamilyName",
            "oldpasswordhash",
            "oldSchool",
            "1",
        );
        userRepository.getById.mockResolvedValue(student);
        userRepository.update.mockResolvedValue(student);
        userRepository.checkByEmail.mockResolvedValue(false);

        const params = {
            id: "1",
            userType: UserType.STUDENT,
            email: "newemail@example.com",
        };

        const result = await updateStudent.execute("", params);

        expect(userRepository.getById).toHaveBeenCalledWith("1");
        expect(userRepository.checkByEmail).toHaveBeenCalledWith("newemail@example.com");
        expect(userRepository.checkByEmail).toHaveBeenCalledWith("newemail@example.com");
        expect(userRepository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "1",
                email: "newemail@example.com",
                firstName: "OldFirstName",
                familyName: "OldFamilyName",
                passwordHash: "oldpasswordhash",
                schoolName: "oldSchool",
            }),
        );
        expect(result).toEqual({});
    });

    it("should throw error if email is the same as old one", async () => {
        const student = new Student("sameemail@example.com", "FirstName", "FamilyName", "passwordhash", "School", "1");
        userRepository.getById.mockResolvedValue(student);
        userRepository.update.mockResolvedValue(student);

        const params = {
            id: "1",
            userType: UserType.STUDENT,
            email: "sameemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "newpasswordhash",
            schoolName: "newSchool",
        };

        await expect(updateStudent.execute("", params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Email cannot be the same as old one.",
        });
    });

    it("should throw error if email is already in use", async () => {
        const student = new Student("oldemail@example.com", "FirstName", "FamilyName", "passwordhash", "school", "1");
        userRepository.getById.mockResolvedValue(student);
        userRepository.update.mockResolvedValue(student);
        userRepository.checkByEmail.mockResolvedValue(true);

        const params = {
            id: "1",
            userType: UserType.STUDENT,
            email: "newemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "newpasswordhash",
            schoolName: "newSchool",
        };

        await expect(updateStudent.execute("", params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Email already in use.",
        });
    });

    it("should throw error if password is the same as old one", async () => {
        const student = new Student(
            "oldemail@example.com",
            "FirstName",
            "FamilyName",
            "samepasswordhash",
            "school",
            "1",
        );
        userRepository.getById.mockResolvedValue(student);
        userRepository.update.mockResolvedValue(student);

        const params = {
            id: "1",
            userType: UserType.STUDENT,
            email: "newemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "samepasswordhash",
            schoolName: "newSchool",
        };

        await expect(updateStudent.execute("", params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Password cannot be the same as old one.",
        });
    });
});
