import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetGroupUsers, GetGroupUsersParams } from "../../../../src/core/services/user";

describe("GetGroupUsers Service - With Students and Teachers", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getGroupUsers: GetGroupUsers;

    beforeEach(() => {
        studentRepository = { getGroupStudents: jest.fn().mockResolvedValue(["student1", "student2"]) } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getGroupTeachers: jest.fn().mockResolvedValue(["teacher1"]) } as unknown as jest.Mocked<ITeacherRepository>;

        getGroupUsers = new GetGroupUsers(teacherRepository, studentRepository);
    });

    it("should return students and teachers for a group", async () => {
        const groupId = "group-123";
        const params = new GetGroupUsersParams(groupId);

        const result = await getGroupUsers.execute(params);

        expect(result).toEqual({ teachers: ["teacher1"], students: ["student1", "student2"] });
        expect(studentRepository.getGroupStudents).toHaveBeenCalledWith(groupId);
        expect(teacherRepository.getGroupTeachers).toHaveBeenCalledWith(groupId);
    });
});
