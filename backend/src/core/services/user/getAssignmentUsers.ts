import { z } from "zod";
import { getAssignmentUsersSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export type GetAssignmentUsersInput = z.infer<typeof getAssignmentUsersSchema>;

export class GetAssignmentUsers implements Service<GetAssignmentUsersInput> {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(input: GetAssignmentUsersInput): Promise<object> {
        const students: object[] = (await this.studentRepository.getAssignmentStudents(input.idParent)).map(s =>
            s.toObject(),
        );
        return { students: students };
    }
}
