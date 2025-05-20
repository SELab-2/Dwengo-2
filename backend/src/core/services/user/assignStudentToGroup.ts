import { z } from "zod";
import { assignStudentToGroupSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type AssignStudentToGroupInput = z.infer<typeof assignStudentToGroupSchema>;

export class AssignStudentToGroup implements Service<AssignStudentToGroupInput> {
    constructor(private userRepository: IUserRepository) {}

    async execute(_userId: string, input: AssignStudentToGroupInput): Promise<object> {
        await tryRepoEntityOperation(
            this.userRepository.assignToGroup(input.id, input.idParent),
            "Student | Group",
            `${input.id} | ${input.idParent}`,
            true,
        );
        return {};
    }
}
