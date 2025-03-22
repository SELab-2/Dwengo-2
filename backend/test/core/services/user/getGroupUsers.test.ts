import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetGroupUsers, GetGroupUsersParams } from "../../../../src/core/services/user";
import { User } from "../../../../src/core/entities/user";

describe("GetGroupUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getGroupUsers: GetGroupUsers;

    beforeEach(() => {
        studentRepository = { getByGroupId: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getByGroupId: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        getGroupUsers = new GetGroupUsers(teacherRepository, studentRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = { id: "s2", email: "student2@example.com", toObject: jest.fn().mockReturnValue({ id: "s2", email: "student2@example.com" }) };

        studentRepository.getByGroupId.mockResolvedValue([mockStudent as unknown as User]);

        const groupId = "group-123";
        const params = new GetGroupUsersParams(groupId);

        const result = await getGroupUsers.execute(params);

        expect(result).toEqual({
            students: [{ id: "s2", email: "student2@example.com" }],
        });

        expect(studentRepository.getByGroupId).toHaveBeenCalledWith(groupId);    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getByGroupId.mockResolvedValue([]);

        const groupId = "group-456";
        const params = new GetGroupUsersParams(groupId);

        const result = await getGroupUsers.execute(params);

        expect(result).toEqual({ students: [] });
    });
});
