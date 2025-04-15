import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { deleteAssignmentSchema } from "../../../application/schemas/assignmentSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type DeleteAssignmentInput = z.infer<typeof deleteAssignmentSchema>;

/**
 * Service class to delete an assignment.
 */
export class DeleteAssignment extends AssignmentService<DeleteAssignmentInput> {
    /**
     * Executes the assignment deletion process.
     * @param input - The input data for deleting an assignment, validated by deleteAssignmentSchema.
     * @returns An empty object.
     * @throws {ApiError} If the assignment with the given id is not found.
     */
    async execute(input: DeleteAssignmentInput): Promise<object> {
        await tryRepoEntityOperation(this.assignmentRepository.delete(input.id), "Assignment", input.id, true);
        return {};
    }
}
