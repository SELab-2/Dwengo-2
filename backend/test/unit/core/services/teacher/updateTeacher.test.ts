import { ErrorCode } from "../../../../../src/application/types";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { UpdateUser } from "../../../../../src/core/services/user";

describe("UpdateTeacher Service", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let updateTeacher: UpdateUser;

    beforeEach(() => {
        userRepository = {
            getById: jest.fn(),
            checkByEmail: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        updateTeacher = new UpdateUser(userRepository);
    });

    it("should update teacher info successfully", async () => {
        const teacher = new Teacher(
            "oldemail@example.com",
            "OldFirstName",
            "OldFamilyName",
            "oldpasswordhash",
            "oldSchool",
            "1",
        );
        userRepository.getById.mockResolvedValue(teacher);
        userRepository.update.mockResolvedValue(teacher);
        userRepository.checkByEmail.mockResolvedValue(false);

        const params = {
            id: "1",
            userType: UserType.TEACHER,
            email: "newemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "newpasswordhash",
            schoolName: "newSchool",
        };

        const result = await updateTeacher.execute(params);

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
        const teacher = new Teacher(
            "oldemail@example.com",
            "OldFirstName",
            "OldFamilyName",
            "oldpasswordhash",
            "oldSchool",
            "1",
        );
        userRepository.getById.mockResolvedValue(teacher);
        userRepository.update.mockResolvedValue(teacher);
        userRepository.checkByEmail.mockResolvedValue(false);

        const params = {
            id: "1",
            userType: UserType.TEACHER,
            email: "newemail@example.com",
        };

        const result = await updateTeacher.execute(params);

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
        const teacher = new Teacher("sameemail@example.com", "FirstName", "FamilyName", "passwordhash", "School", "1");
        userRepository.getById.mockResolvedValue(teacher);
        userRepository.update.mockResolvedValue(teacher);

        const params = {
            id: "1",
            userType: UserType.TEACHER,
            email: "sameemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "newpasswordhash",
            schoolName: "newSchool",
        };

        await expect(updateTeacher.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Email cannot be the same as old one.",
        });
    });

    it("should throw error if email is already in use", async () => {
        const teacher = new Teacher("oldemail@example.com", "FirstName", "FamilyName", "passwordhash", "school", "1");
        userRepository.getById.mockResolvedValue(teacher);
        userRepository.update.mockResolvedValue(teacher);
        userRepository.checkByEmail.mockResolvedValue(true);

        const params = {
            id: "1",
            userType: UserType.TEACHER,
            email: "newemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "newpasswordhash",
            schoolName: "newSchool",
        };

        await expect(updateTeacher.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Email already in use.",
        });
    });

    it("should throw error if password is the same as old one", async () => {
        const teacher = new Teacher(
            "oldemail@example.com",
            "FirstName",
            "FamilyName",
            "samepasswordhash",
            "school",
            "1",
        );
        userRepository.getById.mockResolvedValue(teacher);
        userRepository.update.mockResolvedValue(teacher);

        const params = {
            id: "1",
            userType: UserType.TEACHER,
            email: "newemail@example.com",
            firstName: "NewFirstName",
            familyName: "NewFamilyName",
            passwordHash: "samepasswordhash",
            schoolName: "newSchool",
        };

        await expect(updateTeacher.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Password cannot be the same as old one.",
        });
    });
});
