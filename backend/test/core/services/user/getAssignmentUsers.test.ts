import { User } from "../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { GetAssignmentUsers } from "../../../../src/core/services/user";

describe("GetAssignmentUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let getAssignmentUsers: GetAssignmentUsers;

    beforeEach(() => {
        studentRepository = { getByAssignmentId: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        getAssignmentUsers = new GetAssignmentUsers(studentRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = {
            id: "s3",
            email: "student3@example.com",
            toObject: jest.fn().mockReturnValue({ id: "s3", email: "student3@example.com" }),
        };

        studentRepository.getByAssignmentId.mockResolvedValue([mockStudent as unknown as User]);

        const idParent = "assignment-123";
        const result = await getAssignmentUsers.execute({ idParent });

        expect(result).toEqual({ students: ["s3"] });

        expect(studentRepository.getByAssignmentId).toHaveBeenCalledWith(idParent);
    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getByAssignmentId.mockResolvedValue([]);

        const idParent = "assignment-456";

        const result = await getAssignmentUsers.execute({ idParent });

        expect(result).toEqual({ students: [] });
    });
});
