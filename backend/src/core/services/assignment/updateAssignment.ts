import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { updateAssignmentSchema } from "../../../application/schemas/assignmentSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;

/**
 * Service that updates an assignment.
 */
export class UpdateAssignment extends AssignmentService<UpdateAssignmentInput> {
    /**
     * Executes the assignment update process.
     * @param input - The input data for updating an assignment, validated by UpdateAssignmentInput.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the assignment with the given id is not found.
     */
    async execute(input: UpdateAssignmentInput): Promise<object> {
        const assignment = await this.assignmentRepository.getById(input.id);

        if (input.classId) assignment.class.id = input.classId;
        if (input.learningPathId) assignment.learningPathId = input.learningPathId;
        if (input.start) assignment.start = input.start;
        if (input.deadline) assignment.deadline = input.deadline;
        if (input.name) assignment.name = input.name;
        if (input.extraInstructions) assignment.extraInstructions = input.extraInstructions;

        await tryRepoEntityOperation(this.assignmentRepository.update(assignment), "Assignment", input.id, true);
        return {};
    }
}
