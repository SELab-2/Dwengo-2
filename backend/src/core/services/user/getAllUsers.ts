import { z } from "zod";
import { getAllUsersSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type GetAllUsersInput = z.infer<typeof getAllUsersSchema>;

export class GetAllUsers implements Service<GetAllUsersInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * Executes the all users get process.
     * @param input - The input data for getting all users, validated by getAllUsersSchema.
     * @returns A promise resolving to an object with a list of all users.
     * @throws {Error} If something went wrong.
     */
    async execute(): Promise<object> {
        const studentIds = (await this.studentRepository.getAll()).map(student => student.id);
        const teacherIds = (await this.teacherRepository.getAll()).map(teacher => teacher.id);
        return { students: studentIds, teachers: teacherIds };
    }
}
