import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { GetGroupUsers} from "../../../../src/core/services/user";
import { User } from "../../../../src/core/entities/user";

describe("GetGroupUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let getGroupUsers: GetGroupUsers;

    beforeEach(() => {
        studentRepository = { getGroupStudents: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        getGroupUsers = new GetGroupUsers(studentRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = { id: "s2", email: "student2@example.com", toObject: jest.fn().mockReturnValue({ id: "s2", email: "student2@example.com" }) };

        studentRepository.getGroupStudents.mockResolvedValue([mockStudent as unknown as User]);

        const idParent = "group-123";
        const result = await getGroupUsers.execute({idParent});

        expect(result).toEqual({
            students: [{ id: "s2", email: "student2@example.com" }],
        });

        expect(studentRepository.getGroupStudents).toHaveBeenCalledWith(idParent);    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getGroupStudents.mockResolvedValue([]);

        const idParent = "group-456";
        const result = await getGroupUsers.execute({idParent});

        expect(result).toEqual({ students: [] });
    });
});
