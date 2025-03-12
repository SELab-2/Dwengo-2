import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetAssignmentUsers, GetAssignmentUsersParams } from "../../../../src/core/services/user";

describe("GetAssignmentUsers Service - With Students and Teachers", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getAssignmentUsers: GetAssignmentUsers;

    beforeEach(() => {
        studentRepository = { getAssignmentStudents: jest.fn().mockResolvedValue(["student1", "student2"]) } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getAssignmentTeachers: jest.fn().mockResolvedValue(["teacher1"]) } as unknown as jest.Mocked<ITeacherRepository>;

        getAssignmentUsers = new GetAssignmentUsers(teacherRepository, studentRepository);
    });

    it("should return students and teachers for an assignment", async () => {
        const assignmentId = "assignment-123";
        const params = new GetAssignmentUsersParams(assignmentId);

        const result = await getAssignmentUsers.execute(params);

        expect(result).toEqual({ teachers: ["teacher1"], students: ["student1", "student2"] });
        expect(studentRepository.getAssignmentStudents).toHaveBeenCalledWith(assignmentId);
        expect(teacherRepository.getAssignmentTeachers).toHaveBeenCalledWith(assignmentId);
    });
});
