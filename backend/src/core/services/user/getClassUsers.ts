import { z } from "zod";
import { getClassUsersSchema } from "../../../application/schemas/userSchemas";

import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { tryRepoEntityOperation } from "../../helpers";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type GetClassUsersInput = z.infer<typeof getClassUsersSchema>;

export class GetClassUsers implements Service<GetClassUsersInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * Executes the class users get process.
     * @param input - The input data for getting class users, validated by getClassUsersSchema.
     * @returns A promise resolving to an object with a list of users.
     * @throws {ApiError} If the class with the given id is not found.
     */
    async execute(input: GetClassUsersInput): Promise<object> {
        const students: Student[] = await tryRepoEntityOperation(
            this.studentRepository.getByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        const teachers: Teacher[] = await tryRepoEntityOperation(
            this.teacherRepository.getByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        return { teachers: teachers.map(u => u.id), students: students.map(u => u.id) };
    }
}
