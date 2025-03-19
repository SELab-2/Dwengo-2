import { z } from "zod";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export const assignStudentToGroupSchema = z.object({
    studentId: z.string(),
    groupId: z.string(),
});

export type AssignStudentToGroupInput = z.infer<typeof assignStudentToGroupSchema>;

export class AssignStudentToGroup implements Service<AssignStudentToGroupInput> {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(input: AssignStudentToGroupInput): Promise<object> {
        await this.studentRepository.assignStudentToGroup(input.studentId, input.groupId);
        return {};
    }
}
