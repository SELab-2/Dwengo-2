import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { createAssignmentSchema } from "../../../application/schemas";
import { Assignment } from "../../entities/assignment";

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

/**
 * Service to create an assignment
 */
export class CreateAssignment extends AssignmentService<CreateAssignmentInput> {
    async execute(input: CreateAssignmentInput): Promise<object> {
        const assignment: Assignment = new Assignment(
            input.classId,
            input.learningPathId,
            input.startDate,
            input.deadline,
            input.extraInstructions,
        );

        return { id: (await this.assignmentRepository.create(assignment)).id };
    }
}
