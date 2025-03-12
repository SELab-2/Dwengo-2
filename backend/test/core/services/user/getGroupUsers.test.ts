import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetGroupUsers, GetGroupUsersParams } from "../../../../src/core/services/user";
import { User } from "../../../../src/core/entities/user";

describe("GetGroupUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getGroupUsers: GetGroupUsers;

    beforeEach(() => {
        studentRepository = { getGroupStudents: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getGroupTeachers: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        getGroupUsers = new GetGroupUsers(teacherRepository, studentRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = { id: "s2", email: "student2@example.com", toObject: jest.fn().mockReturnValue({ id: "s2", email: "student2@example.com" }) };
        const mockTeacher = { id: "t2", email: "teacher2@example.com", toObject: jest.fn().mockReturnValue({ id: "t2", email: "teacher2@example.com" }) };

        studentRepository.getGroupStudents.mockResolvedValue([mockStudent as unknown as User]);
        teacherRepository.getGroupTeachers.mockResolvedValue([mockTeacher as unknown as User]);

        const groupId = "group-123";
        const params = new GetGroupUsersParams(groupId);

        const result = await getGroupUsers.execute(params);

        expect(result).toEqual({
            teachers: [{ id: "t2", email: "teacher2@example.com" }],
            students: [{ id: "s2", email: "student2@example.com" }],
        });

        expect(studentRepository.getGroupStudents).toHaveBeenCalledWith(groupId);
        expect(teacherRepository.getGroupTeachers).toHaveBeenCalledWith(groupId);
    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getGroupStudents.mockResolvedValue([]);
        teacherRepository.getGroupTeachers.mockResolvedValue([]);

        const groupId = "group-456";
        const params = new GetGroupUsersParams(groupId);

        const result = await getGroupUsers.execute(params);

        expect(result).toEqual({ teachers: [], students: [] });
    });
});
