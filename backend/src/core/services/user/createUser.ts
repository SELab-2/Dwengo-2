import { ApiError, ErrorCode } from "../../../application/types";
import { Service, ServiceParams } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { User, UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

/**
 * @description class representing the parameters required to create a user.
 */
export class CreateUserParams implements ServiceParams {
    constructor(
        private _email: string,
        private _firstName: string,
        private _familyName: string,
        private _passwordHash: string,
        private _schoolName: string,
        private _userType: UserType,
    ) {}

    get userType() {
        return this._userType;
    }

    /**
     * @description Creates a user object from the provided info and checks if info is valid.
     * @param {IStudentRepository} studentRepository - The student repository.
     * @param {ITeacherRepository} teacherRepository - The teacher repository.
     *
     * @returns {Promise<User>} The created user.
     * @throws {ApiError} If the email is invalid or already in use.
     */
    public async fromObject(
        studentRepository: IStudentRepository,
        teacherRepository: ITeacherRepository,
    ): Promise<User> {
        // Check if email not already in use
        const emailInUse = await Promise.all([
            studentRepository.checkByEmail(this._email),
            teacherRepository.checkTeacherByEmail(this._email),
        ]);
        if (emailInUse.some(present => present)) {
            throw {
                code: ErrorCode.CONFLICT,
                message: "Email already in use.",
            } as ApiError;
        }
        return this.userType === UserType.STUDENT
            ? new Student(this._email, this._firstName, this._familyName, this._passwordHash, this._schoolName)
            : new Teacher(this._email, this._firstName, this._familyName, this._passwordHash, this._schoolName);
    }
}

/**
 * @description Class representing the service for creating a user.
 * @param {IStudentRepository} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class CreateUser implements Service<CreateUserParams> {
    public constructor(
        protected studentRepository: IStudentRepository,
        protected teacherRepository: ITeacherRepository,
    ) {}

    /**
     * @description Executes the service to create a user.
     * @param input - The input parameters to create a user.
     * @returns {Promise<object>} An object containing the ID of the created user.
     */
    async execute(input: CreateUserParams): Promise<object> {
        const user: User = await input.fromObject(this.studentRepository, this.teacherRepository);
        const createdUser: User =
            input.userType === UserType.STUDENT
                ? await this.studentRepository.createStudent(user as Student)
                : await this.teacherRepository.createTeacher(user as Teacher);
        return { userId: createdUser.id! };
    }
}
