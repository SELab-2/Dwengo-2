import { User } from "../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetAllUsers } from "../../../../src/core/services/user";

describe("GetAllUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getAllUsers: GetAllUsers;

    beforeEach(() => {
        studentRepository = { getAll: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getAll: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        getAllUsers = new GetAllUsers(studentRepository, teacherRepository);
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

        studentRepository.getAll.mockResolvedValue([mockStudent as unknown as User]);
        teacherRepository.getAll.mockResolvedValue([mockTeacher as unknown as User]);

        const result = await getAllUsers.execute();

        expect(result).toEqual({
            students: ["s1"],
            teachers: ["t1"],
        });

        expect(studentRepository.getAll).toHaveBeenCalledTimes(1);
        expect(teacherRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it("should return empty lists if no students or teachers exist", async () => {
        studentRepository.getAll.mockResolvedValue([]);
        teacherRepository.getAll.mockResolvedValue([]);

        const result = await getAllUsers.execute();

        expect(result).toEqual({ students: [], teachers: [] });
    });
});
