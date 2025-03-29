import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetClassUsers } from "../../../../src/core/services/user";
import { User } from "../../../../src/core/entities/user";

describe("GetClassUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getClassUsers: GetClassUsers;

    beforeEach(() => {
        studentRepository = { getClassStudents: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getClassTeachers: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        getClassUsers = new GetClassUsers(studentRepository, teacherRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = { id: "s1", email: "student@example.com", toObject: jest.fn().mockReturnValue({ id: "s1", email: "student@example.com" }) };
        const mockTeacher = { id: "t1", email: "teacher@example.com", toObject: jest.fn().mockReturnValue({ id: "t1", email: "teacher@example.com" }) };

        studentRepository.getClassStudents.mockResolvedValue([mockStudent as unknown as User]);
        teacherRepository.getClassTeachers.mockResolvedValue([mockTeacher as unknown as User]);

        const idParent = "class-123";
        const result = await getClassUsers.execute({idParent});

        expect(result).toEqual({
            teachers: ["t1"],
            students: ["s1"],
        });

        expect(studentRepository.getClassStudents).toHaveBeenCalledWith(idParent);
        expect(teacherRepository.getClassTeachers).toHaveBeenCalledWith(idParent);
    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getClassStudents.mockResolvedValue([]);
        teacherRepository.getClassTeachers.mockResolvedValue([]);

        const idParent = "class-456";
        const result = await getClassUsers.execute({idParent});

        expect(result).toEqual({ teachers: [], students: [] });
    });
});
