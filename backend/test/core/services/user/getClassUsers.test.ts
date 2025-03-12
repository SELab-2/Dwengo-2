import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetClassUsers, GetClassUsersParams } from "../../../../src/core/services/user";
import { User } from "../../../../src/core/entities/user";

describe("GetClassUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getClassUsers: GetClassUsers;

    beforeEach(() => {
        studentRepository = { getClassStudents: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getClassTeachers: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        getClassUsers = new GetClassUsers(teacherRepository, studentRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = { id: "s1", email: "student@example.com", toObject: jest.fn().mockReturnValue({ id: "s1", email: "student@example.com" }) };
        const mockTeacher = { id: "t1", email: "teacher@example.com", toObject: jest.fn().mockReturnValue({ id: "t1", email: "teacher@example.com" }) };

        studentRepository.getClassStudents.mockResolvedValue([mockStudent as unknown as User]);
        teacherRepository.getClassTeachers.mockResolvedValue([mockTeacher as unknown as User]);

        const classId = "class-123";
        const params = new GetClassUsersParams(classId);

        const result = await getClassUsers.execute(params);

        expect(result).toEqual({
            teachers: [{ id: "t1", email: "teacher@example.com" }],
            students: [{ id: "s1", email: "student@example.com" }],
        });

        expect(studentRepository.getClassStudents).toHaveBeenCalledWith(classId);
        expect(teacherRepository.getClassTeachers).toHaveBeenCalledWith(classId);
    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getClassStudents.mockResolvedValue([]);
        teacherRepository.getClassTeachers.mockResolvedValue([]);

        const classId = "class-456";
        const params = new GetClassUsersParams(classId);

        const result = await getClassUsers.execute(params);

        expect(result).toEqual({ teachers: [], students: [] });
    });
});
