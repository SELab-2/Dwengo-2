import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetAssignmentUsers, GetAssignmentUsersParams } from "../../../../src/core/services/user";
import { User } from "../../../../src/core/entities/user";

describe("GetAssignmentUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getAssignmentUsers: GetAssignmentUsers;

    beforeEach(() => {
        studentRepository = { getAssignmentStudents: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getAssignmentTeachers: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        getAssignmentUsers = new GetAssignmentUsers(teacherRepository, studentRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = { id: "s3", email: "student3@example.com", toObject: jest.fn().mockReturnValue({ id: "s3", email: "student3@example.com" }) };

        studentRepository.getAssignmentStudents.mockResolvedValue([mockStudent as unknown as User]);

        const assignmentId = "assignment-123";
        const params = new GetAssignmentUsersParams(assignmentId);

        const result = await getAssignmentUsers.execute(params);

        expect(result).toEqual({students: [{ id: "s3", email: "student3@example.com" }]});

        expect(studentRepository.getAssignmentStudents).toHaveBeenCalledWith(assignmentId);
    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getAssignmentStudents.mockResolvedValue([]);

        const assignmentId = "assignment-456";
        const params = new GetAssignmentUsersParams(assignmentId);

        const result = await getAssignmentUsers.execute(params);

        expect(result).toEqual({ students: [] });
    });
});
