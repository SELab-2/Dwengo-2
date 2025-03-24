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
     * @param id - The ID of the user to be removed.
     * @param idParent - The ID of the group.
     * @param userType - The type of the user (should be student).
     *
     * @returns A promise that resolves when the user is removed.
     * @throws ApiError if the user type is not a student.
     */
    public async removeUser(id: string, idParent: string, userType: UserType): Promise<void> {
        if (userType == UserType.STUDENT) {
            await this.studentRepository.removeStudentFromGroup(id, idParent);
        } else {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Only students can be part of a group.",
            } as ApiError;
        }
    }
}
