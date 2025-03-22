import { Service, ServiceParams } from "../../../config/service";
import { User, UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

/**
 * @description Parameters required to get a user.
 * @param _id - The ID of the user to get.
 * @param _userType - The type of the user (student or teacher).
 */
export class GetUserParams implements ServiceParams {
    constructor(
        private _id: string,
        private _userType: UserType,
    ) {}

    public get id() {
        return this._id;
    }

    public get userType() {
        return this._userType;
    }
}

/**
 * @description Class representing the service for getting a user.
 * @param {IStudentRepository} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class GetUser implements Service<GetUserParams> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}
    /**
     * Gets a user from the DB.
     *
     * @param id ID of the user to get from the DB.
     * @returns the user with the given id.
     *
     * @throws Error if the user is not present.
     */
    async execute(input: GetUserParams): Promise<object> {
        const user: User =
            input.userType === UserType.STUDENT
                ? await this.studentRepository.getById(input.id)
                : await this.teacherRepository.getById(input.id);

        return user;
    }
}
