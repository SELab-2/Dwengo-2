import { z } from "zod";
import { getAssignmentSchema } from "../../../application/schemas/assignmentSchemas";
import { Service } from "../../../config/service";
import { tryRepoEntityOperation } from "../../helpers";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";

export type GetAssignmentInput = z.infer<typeof getAssignmentSchema>;

/**
 * Service class to get an assignment.
 */
export class GetAssignment implements Service<GetAssignmentInput> {
    public constructor(private assignmentRepository: IAssignmentRepository) {}

    /**
     * Executes the assignment get process.
     * @param input - The input data for getting an assignment, validated by getAssignmentSchema.
     * @returns A promise resolving to an assignment transformed into an object.
     * @throws {ApiError} If the assignment with the given id is not found.
     */
    async execute(input: GetAssignmentInput): Promise<object> {
        const queriedAssignment = await tryRepoEntityOperation(
            this.assignmentRepository.getById(input.id),
            "Assignment",
            input.id,
            true,
        );

        // TODO: maybe just return the queriedAssignment directly? The class will be a nested object then: `{ class: {id: ...}, ...}´
        // But it would be cleaner code
        return {
            classId: queriedAssignment.class.id,
            deadline: queriedAssignment.deadline,
            start: queriedAssignment.start,
            extraInstructions: queriedAssignment.extraInstructions,
            learningPathId: queriedAssignment.learningPathId,
            name: queriedAssignment.name,
            id: queriedAssignment.id,
        };
    }
}
