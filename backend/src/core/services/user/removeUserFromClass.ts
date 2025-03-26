import { RemoveUserFrom } from "./removeUserFrom";
import { UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

/**
 * Service for removing a user from a class.
 * @param studentRepository - Repository for student data.
 * @param teacherRepository - Repository for teacher data.
 */
export class RemoveUserFromClass extends RemoveUserFrom {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {
        super();
    }

    /**
     * Removes a user from a class.
     *
     * @param id - The ID of the user to be removed.
     * @param idParent - The ID of the class.
     * @param userType - The type of the user (student or teacher).
     * @returns A promise that resolves when the user is removed.
     */
    public async removeUser(id: string, idParent: string, userType: UserType): Promise<void> {
        if (userType == UserType.STUDENT) {
            await this.studentRepository.removeFromClass(id, idParent);
        } else {
            await this.teacherRepository.removeFromClass(id, idParent);
        }
    }
}
