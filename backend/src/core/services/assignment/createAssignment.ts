import { z } from "zod";
import { createAssignmentSchema } from "./assignmentSchemas";
import { AssignmentService } from "./assignmentService";
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

        return { id: (await this.assignmentRepository.createAssignment(assignment, input.classId)).id };
    }
}
