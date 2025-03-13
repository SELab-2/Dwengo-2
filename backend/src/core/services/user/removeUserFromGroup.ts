import { RemoveUserFrom } from "./removeUserFrom";
import { ApiError, ErrorCode } from "../../../application/types";
import { UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

/**
 * Service for removing a user from a group.
 * @param studentRepository - Repository for student data.
 */
export class RemoveUserFromGroup extends RemoveUserFrom {
    constructor(private studentRepository: IStudentRepository) {
        super();
    }

    /**
     * Removes a user from a group.
     *
     * @param userId - The ID of the user to be removed.
     * @param otherId - The ID of the group.
     * @param userType - The type of the user (should be student).
     *
     * @returns A promise that resolves when the user is removed.
     * @throws ApiError if the user type is not a student.
     */
    public async removeUser(userId: string, otherId: string, userType: UserType): Promise<void> {
        if (userType == UserType.STUDENT) {
            await this.studentRepository.removeStudentFromGroup(userId, otherId);
        } else {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Only students can be part of a group.",
            } as ApiError;
        }
    }
}
