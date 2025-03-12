import { UserType } from "../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { AssignUserToAssignment, AssignUserToAssignmentParams } from "../../../../src/core/services/user";


describe("AssignUserToAssignment Service - Student", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let assignUserToAssignment: AssignUserToAssignment;

    beforeEach(() => {
        studentRepository = { assignStudentToAssignment: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { assignTeacherToAssignment: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        assignUserToAssignment = new AssignUserToAssignment(teacherRepository, studentRepository);
    });

    it("should call assignStudentToAssignment for a student", async () => {
        const userId = "student-123";
        const otherId = "assignment-456";
        const params = new AssignUserToAssignmentParams(userId, otherId, UserType.STUDENT);

        await assignUserToAssignment.execute(params);

        expect(studentRepository.assignStudentToAssignment).toHaveBeenCalledTimes(1);
        expect(studentRepository.assignStudentToAssignment).toHaveBeenCalledWith(userId, otherId);
        expect(teacherRepository.assignTeacherToAssignment).not.toHaveBeenCalled();
    });
});
