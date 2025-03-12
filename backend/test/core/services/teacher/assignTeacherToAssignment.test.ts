import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { AssignTeacherToAssignment, AssignTeacherToAssignmentParams } from "../../../../src/core/services/user";
import { EntityNotFoundError } from "../../../../src/config/error";

describe("AssignTeacherToAssignment Service", () => {
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let assignTeacherToAssignment: AssignTeacherToAssignment;

    beforeEach(() => {
        teacherRepository = { assignTeacherToAssignment: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        assignTeacherToAssignment = new AssignTeacherToAssignment(teacherRepository);
    });

    it("should call assignTeacherToAssignment with correct parameters", async () => {
        const teacherId = "teacher-789";
        const assignmentId = "assignment-456";
        const params = new AssignTeacherToAssignmentParams(teacherId, assignmentId);

        await assignTeacherToAssignment.execute(params);

        expect(teacherRepository.assignTeacherToAssignment).toHaveBeenCalledTimes(1);
        expect(teacherRepository.assignTeacherToAssignment).toHaveBeenCalledWith(teacherId, assignmentId);
    });

    it("should throw an error if the teacher does not exist", async () => {
        teacherRepository.assignTeacherToAssignment.mockRejectedValue(new EntityNotFoundError("Teacher not found"));

        const teacherId = "nonexistent-teacher";
        const assignmentId = "assignment-456";
        const params = new AssignTeacherToAssignmentParams(teacherId, assignmentId);

        await expect(assignTeacherToAssignment.execute(params)).rejects.toThrow(EntityNotFoundError);
        expect(teacherRepository.assignTeacherToAssignment).toHaveBeenCalledWith(teacherId, assignmentId);
    });

    it("should throw an error if the repository encounters an unexpected error", async () => {
        teacherRepository.assignTeacherToAssignment.mockRejectedValue(new Error("Database connection failed"));

        const teacherId = "teacher-789";
        const assignmentId = "assignment-456";
        const params = new AssignTeacherToAssignmentParams(teacherId, assignmentId);

        await expect(assignTeacherToAssignment.execute(params)).rejects.toThrow("Database connection failed");
        expect(teacherRepository.assignTeacherToAssignment).toHaveBeenCalledWith(teacherId, assignmentId);
    });
});
