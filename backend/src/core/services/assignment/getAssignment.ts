import { z } from "zod";
import { getAssignmentSchema } from "./assignmentSchemas";
import { Service } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";

type GetAssignmentInput = z.infer<typeof getAssignmentSchema>;

/**
 * Service class to get an assignment.
 */
export class GetAssignment implements Service<GetAssignmentInput> {
    public constructor(private assignmentRepository: IAssignmentRepository) {}

    async execute(input: GetAssignmentInput): Promise<object> {
        return (await this.assignmentRepository.getAssignmentById(input.id)).toObject();
    }
}
