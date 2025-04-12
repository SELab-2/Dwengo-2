import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { updateAssignmentSchema } from "../../../application/schemas/assignmentSchemas";
import { Assignment } from "../../entities/assignment";
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
        const updatedFields: Partial<Assignment> = {};

        if (input.classId) updatedFields.classId = input.classId;
        if (input.learningPathId) updatedFields.learningPathId = input.learningPathId;
        if (input.startDate) updatedFields.startDate = input.startDate;
        if (input.deadline) updatedFields.deadline = input.deadline;
        if (input.extraInstructions) updatedFields.extraInstructions = input.extraInstructions;

        await tryRepoEntityOperation(
            this.assignmentRepository.update(input.id, updatedFields),
            "Assignment",
            input.id,
            true,
        );
        return {};
    }
}
