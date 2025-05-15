import { User } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { GetAllUsers } from "../../../../../src/core/services/user";

describe("GetAllUsers Service", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let getAllUsers: GetAllUsers;

    beforeEach(() => {
        userRepository = { 
            getAllStudents: jest.fn(),
            getAllTeachers: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>;

        getAllUsers = new GetAllUsers(userRepository);
    });

    it("should return all students and teachers as objects", async () => {
        const mockStudent = {
            id: "s1",
            email: "student@example.com",
            firstName: "John",
            familyName: "Doe",
            schoolName: "School A",
            toObject: jest.fn(),
        };
        const mockTeacher = {
            id: "t1",
            email: "teacher@example.com",
            firstName: "Jane",
            familyName: "Smith",
            schoolName: "School B",
            toObject: jest.fn(),
        };

        mockStudent.toObject.mockReturnValue({
            id: "s1",
            email: "student@example.com",
            firstName: "John",
            familyName: "Doe",
            schoolName: "School A",
        });
        mockTeacher.toObject.mockReturnValue({
            id: "t1",
            email: "teacher@example.com",
            firstName: "Jane",
            familyName: "Smith",
            schoolName: "School B",
        });

        userRepository.getAllStudents.mockResolvedValue([mockStudent as unknown as User]);
        userRepository.getAllTeachers.mockResolvedValue([mockTeacher as unknown as User]);

        const result = await getAllUsers.execute();

        expect(result).toEqual({
            students: ["s1"],
            teachers: ["t1"],
        });

        expect(userRepository.getAllStudents).toHaveBeenCalledTimes(1);
        expect(userRepository.getAllTeachers).toHaveBeenCalledTimes(1);
    });

    it("should return empty lists if no students or teachers exist", async () => {
        userRepository.getAllStudents.mockResolvedValue([]);
        userRepository.getAllTeachers.mockResolvedValue([]);

        const result = await getAllUsers.execute();

        expect(result).toEqual({ students: [], teachers: [] });
    });
});
