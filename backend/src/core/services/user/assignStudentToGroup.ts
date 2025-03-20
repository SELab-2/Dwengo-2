import { z } from "zod";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { assignStudentToGroupSchema } from "./userSchemas";



export type AssignStudentToGroupInput = z.infer<typeof assignStudentToGroupSchema>;

export class AssignStudentToGroup implements Service<AssignStudentToGroupInput> {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(input: AssignStudentToGroupInput): Promise<object> {
        await this.studentRepository.assignStudentToGroup(input.studentId, input.groupId);
        return {};
    }
}
