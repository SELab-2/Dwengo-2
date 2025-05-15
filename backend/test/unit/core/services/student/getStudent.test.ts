import { ApiError, ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { Student } from "../../../../../src/core/entities/student";
import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { GetUser } from "../../../../../src/core/services/user/getUser";

describe("getStudent Service", () => {
    let getStudentService: GetUser;
    let userRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        userRepository = {
            getById: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>;

        getStudentService = new GetUser(userRepository);
    });

    test("Should return student if found", async () => {
        const student = new Student("test@student.com", "John", "Doe", "hashedpassword123", "Yale", "1");

        const params = { id: "1", userType: UserType.STUDENT };

        userRepository.getById.mockResolvedValue(student);
        const result = await getStudentService.execute(params);

        expect(result).toEqual(student.toObject());
        expect(userRepository.getById).toHaveBeenCalledWith("1");
    });

    test("Should throw error", async () => {
        userRepository.getById.mockRejectedValue(new EntityNotFoundError("Student not found"));

        const params = { id: "999", userType: UserType.STUDENT };

        await expect(getStudentService.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
        expect(userRepository.getById).toHaveBeenCalledWith("999");
    });
});
