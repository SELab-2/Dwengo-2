import { RemoveUserFrom } from "./removeUserFrom";
import { ApiError, ErrorCode } from "../../../application/types";
import { UserType } from "../../entities/user";
import { IUserRepository } from "../../repositories/userRepositoryInterface";
import { tryRepoEntityOperation } from "../../helpers";

/**
 * Service for removing a user from a group.
 * @param userRepository - Repository for student data.
 */
export class RemoveUserFromGroup extends RemoveUserFrom {
    constructor(private userRepository: IUserRepository) {
        super();
    }

    /**
     * Removes a user from a group.
     *
     * @param id - The ID of the user (should be student) to be removed.
     * @param idParent - The ID of the group.
     *
     * @returns A promise that resolves when the user is removed.
     * @throws ApiError if the user type is not a student.
     */
    public async removeUser(id: string, idParent: string): Promise<void> {
        const user = await this.userRepository.getById(id);
        
        if (user.userType == UserType.STUDENT) {
            await this.userRepository.removeFromGroup(id, idParent);
        } else {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Only students can be part of a group.",
            } as ApiError;
        }
    }
}
