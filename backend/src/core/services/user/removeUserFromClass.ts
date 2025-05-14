import { RemoveUserFrom } from "./removeUserFrom";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

/**
 * Service for removing a user from a class.
 * @param userRepository - Repository for user data.
 */
export class RemoveUserFromClass extends RemoveUserFrom {
    constructor(
        private userRepository: IUserRepository,
    ) {
        super();
    }

    /**
     * Removes a user from a class.
     *
     * @param id - The ID of the user to be removed.
     * @param idParent - The ID of the class.
     * @returns A promise that resolves when the user is removed.
     */
    public async removeUser(id: string, idParent: string): Promise<void> {
        await this.userRepository.removeFromClass(id, idParent);
    }
}
