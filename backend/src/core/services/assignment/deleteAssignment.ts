import { z } from "zod";
import { deleteAssignmentSchema } from "./assignmentSchemas";
import { AssignmentService } from "./assignmentService";

export type DeleteAssignmentInput = z.infer<typeof deleteAssignmentSchema>;

/**
 * Service class to delete an assignment.
 */
export class DeleteAssignment extends AssignmentService<DeleteAssignmentInput> {
    async execute(input: DeleteAssignmentInput): Promise<object> {
        await this.assignmentRepository.deleteAssignmentById(input.id);
        return {};
    }
}
