import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { createAssignmentSchema } from "../../../application/schemas";
import { Assignment } from "../../entities/assignment";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

/**
 * Service to create an assignment
 */
export class CreateAssignment extends AssignmentService<CreateAssignmentInput> {
    /**
     * Executes the assignment creation process.
     * @param input - The input data for creating an assignment, validated by createAssignmentSchema.
     * @returns A promise resolving to an object containing the ID of the created assignment.
     * @throws {ApiError} If the class with the given classId is not found or if the creation fails.
     */
    async execute(userId: string, input: CreateAssignmentInput): Promise<object> {
        await validateUserRights(userId, UserType.TEACHER);

        const assignment: Assignment = new Assignment(
            input.classId,
            input.learningPathId,
            input.startDate,
            input.deadline,
            input.name,
            input.extraInstructions,
        );

        const createdAssignment = await tryRepoEntityOperation(
            this.assignmentRepository.create(assignment),
            "Class",
            input.classId,
            true,
        );

        return {
            id: createdAssignment.id,
        };
    }
}
