import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { createAssignmentSchema } from "../../../application/schemas";
import { AssignmentTypeORM as Assignment } from "../../../infrastructure/database/data/data_models/assignmentTypeorm";
import { ClassTypeORM as Class } from "../../../infrastructure/database/data/data_models/classTypeorm";
import { tryRepoEntityOperation } from "../../helpers";

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
    async execute(input: CreateAssignmentInput): Promise<object> {
        const assignment: Assignment = new Assignment();
        assignment.class = new Class();
        assignment.class.id = input.classId;
        assignment.learningPathId = input.learningPathId;
        assignment.start = input.start;
        assignment.deadline = input.deadline;
        assignment.name = input.name;
        assignment.extraInstructions = input.extraInstructions;

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
