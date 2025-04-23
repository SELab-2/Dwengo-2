import { z } from "zod";
import { assignStudentToGroupSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { tryRepoEntityOperation } from "../../helpers";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export type AssignStudentToGroupInput = z.infer<typeof assignStudentToGroupSchema>;

export class AssignStudentToGroup implements Service<AssignStudentToGroupInput> {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(input: AssignStudentToGroupInput): Promise<object> {
        await tryRepoEntityOperation(
            this.studentRepository.assignToGroup(input.id, input.idParent),
            "Student | Group",
            `${input.id} | ${input.idParent}`,
            true,
        );
        return {};
    }
}
