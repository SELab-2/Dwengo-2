import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { RemoveUserFromClass } from "../../../../../src/core/services/user";

describe("RemoveTeacherFromClass service", () => {
    let userRepository: IUserRepository;
    let removeTeacherFromClass: RemoveUserFromClass;

    beforeEach(() => {
        userRepository = {
            removeFromClass: jest.fn(),
        } as unknown as IUserRepository;
        removeTeacherFromClass = new RemoveUserFromClass(userRepository);
    });

    it("should remove a teacher from a class", async () => {
        const id = "teacher123";
        const idParent = "class456";
        const userType = UserType.TEACHER;
        const params = {
            id,
            idParent,
            userType,
        };

        await removeTeacherFromClass.execute(params);

        expect(userRepository.removeFromClass).toHaveBeenCalledWith(id, idParent);
    });

    it("should return an empty object after removing a teacher", async () => {
        const id = "teacher123";
        const idParent = "class456";
        const userType = UserType.TEACHER;
        const params = {
            id,
            idParent,
            userType,
        };

        const result = await removeTeacherFromClass.execute(params);

        expect(result).toEqual({});
    });
});
