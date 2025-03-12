import { UserType } from "../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { AssignUserToAssignment, AssignUserToAssignmentParams } from "../../../../src/core/services/user";

describe("AssignUserToAssignment Service - Teacher", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let assignUserToAssignment: AssignUserToAssignment;

    beforeEach(() => {
        studentRepository = { assignStudentToAssignment: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { assignTeacherToAssignment: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        assignUserToAssignment = new AssignUserToAssignment(teacherRepository, studentRepository);
    });

    it("should call assignTeacherToAssignment for a teacher", async () => {
        const userId = "teacher-789";
        const otherId = "assignment-456";
        const params = new AssignUserToAssignmentParams(userId, otherId, UserType.TEACHER);

        await assignUserToAssignment.execute(params);

        expect(teacherRepository.assignTeacherToAssignment).toHaveBeenCalledTimes(1);
        expect(teacherRepository.assignTeacherToAssignment).toHaveBeenCalledWith(userId, otherId);
        expect(studentRepository.assignStudentToAssignment).not.toHaveBeenCalled();
    });
});
