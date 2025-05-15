import { User } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { GetGroupUsers } from "../../../../../src/core/services/user";

describe("GetGroupUsers Service", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let getGroupUsers: GetGroupUsers;

    beforeEach(() => {
        userRepository = { getByGroupId: jest.fn() } as unknown as jest.Mocked<IUserRepository>;
        getGroupUsers = new GetGroupUsers(userRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = {
            id: "s2",
            email: "student2@example.com",
            toObject: jest.fn().mockReturnValue({ id: "s2", email: "student2@example.com" }),
        };

        userRepository.getByGroupId.mockResolvedValue([mockStudent as unknown as User]);

        const idParent = "group-123";
        const result = await getGroupUsers.execute({ idParent });

        expect(result).toEqual({
            students: ["s2"],
        });

        expect(userRepository.getByGroupId).toHaveBeenCalledWith(idParent);
    });

    it("should return empty arrays if no users found", async () => {
        userRepository.getByGroupId.mockResolvedValue([]);

        const idParent = "group-456";
        const result = await getGroupUsers.execute({ idParent });

        expect(result).toEqual({ students: [] });
    });
});
