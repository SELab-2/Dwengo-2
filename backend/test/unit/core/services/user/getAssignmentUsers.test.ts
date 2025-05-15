import { User } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { GetAssignmentUsers } from "../../../../../src/core/services/user";

describe("GetAssignmentUsers Service", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let getAssignmentUsers: GetAssignmentUsers;

    beforeEach(() => {
        userRepository = { getByAssignmentId: jest.fn() } as unknown as jest.Mocked<IUserRepository>;
        getAssignmentUsers = new GetAssignmentUsers(userRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = {
            id: "s3",
            email: "student3@example.com",
            toObject: jest.fn().mockReturnValue({ id: "s3", email: "student3@example.com" }),
        };

        userRepository.getByAssignmentId.mockResolvedValue([mockStudent as unknown as User]);

        const idParent = "assignment-123";
        const result = await getAssignmentUsers.execute({ idParent });

        expect(result).toEqual({ students: ["s3"] });

        expect(userRepository.getByAssignmentId).toHaveBeenCalledWith(idParent);
    });

    it("should return empty arrays if no users found", async () => {
        userRepository.getByAssignmentId.mockResolvedValue([]);

        const idParent = "assignment-456";

        const result = await getAssignmentUsers.execute({ idParent });

        expect(result).toEqual({ students: [] });
    });
});
