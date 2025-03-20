import { z } from "zod";
import { updateAssignmentSchema } from "./assignmentSchemas";
import { AssignmentService } from "./assignmentService";
import { Assignment } from "../../entities/assignment";

type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;

/**
 * Service that updates an assignment.
 */
export class UpdateAssignment extends AssignmentService<UpdateAssignmentInput> {
    async execute(input: UpdateAssignmentInput): Promise<object> {
        const updatedFields: Partial<Assignment> = {};

        if (input.classId) updatedFields.classId = input.classId;
        if (input.learningPathId) updatedFields.learningPathId = input.learningPathId;
        if (input.startDate) updatedFields.startDate = input.startDate;
        if (input.deadline) updatedFields.deadline = input.deadline;
        if (input.extraInstructions) updatedFields.extraInstructions = input.extraInstructions;

        return (await this.assignmentRepository.updateAssignmentById(input.id, updatedFields)).toObject();
    }
}
