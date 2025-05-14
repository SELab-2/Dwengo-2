import { z } from "zod";
import { getClassUsersSchema } from "../../../application/schemas/userSchemas";

import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type GetClassUsersInput = z.infer<typeof getClassUsersSchema>;

export class GetClassUsers implements Service<GetClassUsersInput> {
    constructor(
        private userRepository: IUserRepository,
    ) {}

    /**
     * Executes the class users get process.
     * @param input - The input data for getting class users, validated by getClassUsersSchema.
     * @returns A promise resolving to an object with a list of users.
     * @throws {ApiError} If the class with the given id is not found.
     */
    async execute(input: GetClassUsersInput): Promise<object> {
        const students: Student[] = await tryRepoEntityOperation(
            this.userRepository.getStudentsByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        const teachers: Teacher[] = await tryRepoEntityOperation(
            this.userRepository.getTeachersByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        return { teachers: teachers.map(u => u.id), students: students.map(u => u.id) };
    }
}
