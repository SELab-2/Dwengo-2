import { Student } from "../../entities/student";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";
import { CreateStudentParams, CreateUser } from "../user";

/**
 * @extends {CreateUser<Student, CreateStudentParams>}
 * @description Class representing the use case for creating a student.
 * @param {StudentRepositoryInterface} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class CreateStudent extends CreateUser<Student, CreateStudentParams> {
    public constructor(
        studentRepository: IStudentRepository,
        teacherRepository: ITeacherRepository,
    ) {
        super(studentRepository, teacherRepository)
    }

    /**
     * @description Creates a student.
     * @param {Student} user - The student to be created.
     * @returns {Promise<string>} The id of the created student.
     */
    public async createUser(user: Student): Promise<string> {
        const result = await this.studentRepository.createStudent(user)
        return result.id!;

    }
}