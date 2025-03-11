import { Teacher } from "../../entities/teacher";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";
import { CreateParams, CreateUser } from "../user";

/**
 * @extends {CreateParams<Teacher>}
 * @description Class representing the parameters required to create a teacher.
 */
export class CreateTeacherParams extends CreateParams<Teacher> {
  createUser(): Teacher {
    return new Teacher(
      this.email,
      this.firstName,
      this.familyName,
      this.passwordHash,
      this.schoolName,
    );
  }
}

/**
 * @extends {CreateUser<Teacher, CreateTeacherParams>}
 * @description Class representing the use case for creating a teacher.
 * @param {IStudentRepository} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class CreateTeacher extends CreateUser<Teacher, CreateTeacherParams> {
    public constructor(
        studentRepository: IStudentRepository,
        teacherRepository: ITeacherRepository,
    ) {
        super(studentRepository, teacherRepository)
    }

    /**
     * @description Creates a teacher.
     * @param {Teacher} user - The teacher to be created.
     * @returns {Promise<string>} The id of the created teacher.
     */
    public async createUser(user: Teacher): Promise<string> {
        const result: Teacher = await this.teacherRepository.createTeacher(user)
        return result.id!;

    }
}