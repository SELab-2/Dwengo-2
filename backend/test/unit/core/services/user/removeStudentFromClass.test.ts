import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { RemoveUserFromClass } from "../../../../../src/core/services/user";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

describe("RemoveStudentFromClass", () => {
    let userRepository: IUserRepository;
    let removeStudentFromClass: RemoveUserFromClass;

    beforeEach(() => {
        userRepository = {
            removeFromClass: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;
        removeStudentFromClass = new RemoveUserFromClass(userRepository);
        mockValidateUserRights.mockResolvedValue();
    });

    it("should remove a student from a class", async () => {
        const id = "student123";
        const idParent = "class456";
        const userType = UserType.STUDENT;

        await removeStudentFromClass.execute("", { id, idParent });

        expect(userRepository.removeFromClass).toHaveBeenCalledWith(id, idParent);
    });

    it("should return an empty object after removing a student", async () => {
        const id = "student123";
        const idParent = "class456";
        const userType = UserType.STUDENT;
        const params = { id, idParent, userType };

        const result = await removeStudentFromClass.execute("", params);

        expect(result).toEqual({});
    });
});
