import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { GetAssignmentUsers } from "../../../../src/core/services/user";
import { User } from "../../../../src/core/entities/user";

describe("GetAssignmentUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let getAssignmentUsers: GetAssignmentUsers;

    beforeEach(() => {
        studentRepository = { getAssignmentStudents: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        getAssignmentUsers = new GetAssignmentUsers(studentRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = { id: "s3", email: "student3@example.com", toObject: jest.fn().mockReturnValue({ id: "s3", email: "student3@example.com" }) };

        studentRepository.getAssignmentStudents.mockResolvedValue([mockStudent as unknown as User]);

        const idParent = "assignment-123";
        const result = await getAssignmentUsers.execute({ idParent });

        expect(result).toEqual({students: [{ id: "s3", email: "student3@example.com" }]});

        expect(studentRepository.getAssignmentStudents).toHaveBeenCalledWith(idParent);
    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getAssignmentStudents.mockResolvedValue([]);

        const idParent = "assignment-456";

        const result = await getAssignmentUsers.execute({idParent});

        expect(result).toEqual({ students: [] });
    });
});
