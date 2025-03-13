import { Service, ServiceParams } from "../../../config/service";
import { UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

/**
 * @description Parameters required to delete a user.
 * @param _id - The ID of the user to delete.
 * @param _userType - The type of the user (student or teacher).
 */
export class DeleteUserParams implements ServiceParams {
    constructor(
        private _id: string,
        private _userType: UserType,
    ) {}

    public get id(): string {
        return this._id;
    }

    public get userType(): string {
        return this._userType;
    }
}

/**
 * @description Class representing the service for deleting a user.
 * @param {IStudentRepository} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class DeleteUser implements Service<DeleteUserParams> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}
    /**
     * Delete a student from the DB.
     *
     * @param params Parameters containing the ID of the user to delete.
     * @returns void
     * @throws Error if the user that will be deleted does not exist.
     */
    async execute(input: DeleteUserParams): Promise<object> {
        if (input.userType == UserType.STUDENT) {
            await this.studentRepository.deleteStudentById(input.id);
        } else {
            await this.teacherRepository.deleteTeacherWithId(input.id);
        }
        return {};
    }
}
