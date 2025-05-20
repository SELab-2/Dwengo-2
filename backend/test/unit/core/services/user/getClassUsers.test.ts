import { User } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { GetClassUsers } from "../../../../../src/core/services/user";

describe("GetClassUsers Service", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let getClassUsers: GetClassUsers;

    beforeEach(() => {
        userRepository = {
            getStudentsByClassId: jest.fn(),
            getTeachersByClassId: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>;

        getClassUsers = new GetClassUsers(userRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = {
            id: "s1",
            email: "student@example.com",
            toObject: jest.fn().mockReturnValue({ id: "s1", email: "student@example.com" }),
        };
        const mockTeacher = {
            id: "t1",
            email: "teacher@example.com",
            toObject: jest.fn().mockReturnValue({ id: "t1", email: "teacher@example.com" }),
        };

        userRepository.getStudentsByClassId.mockResolvedValue([mockStudent as unknown as User]);
        userRepository.getTeachersByClassId.mockResolvedValue([mockTeacher as unknown as User]);

        const idParent = "class-123";
        const result = await getClassUsers.execute("", { idParent });

        expect(result).toEqual({
            teachers: ["t1"],
            students: ["s1"],
        });

        expect(userRepository.getStudentsByClassId).toHaveBeenCalledWith(idParent);
        expect(userRepository.getTeachersByClassId).toHaveBeenCalledWith(idParent);
    });

    it("should return empty arrays if no users found", async () => {
        userRepository.getStudentsByClassId.mockResolvedValue([]);
        userRepository.getTeachersByClassId.mockResolvedValue([]);

        const idParent = "class-456";
        const result = await getClassUsers.execute("", { idParent });

        expect(result).toEqual({ teachers: [], students: [] });
    });
});
