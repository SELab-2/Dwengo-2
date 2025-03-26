import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { deleteAssignmentSchema } from "../../../application/schemas/assignmentSchemas";

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
