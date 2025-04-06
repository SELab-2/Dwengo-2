import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { getUserAssignmentsSchema } from "../../../application/schemas/assignmentSchemas";
import { Assignment } from "../../entities/assignment";
import { tryRepoEntityOperation } from "../../helpers";

export type GetUserAssignmentsInput = z.infer<typeof getUserAssignmentsSchema>;

/**
 * Service class to get all assignments of a user.
 */
export class GetUserAssignments extends AssignmentService<GetUserAssignmentsInput> {
    /**
     * Executes the user assignments get process.
     * @param input - The input data for getting user assignments, validated by getUserAssignmentsSchema.
     * @returns A promise resolving to an object with a list of assignments.
     * @throws {ApiError} If the user with the given id is not found.
     */
    async execute(input: GetUserAssignmentsInput): Promise<object> {
        const assignments: Assignment[] = await tryRepoEntityOperation(
            this.assignmentRepository.getByUserId(input.idParent),
            "User",
            input.idParent,
            true,
        );
        return { assignments: assignments.map(assignment => assignment.id) };
    }
}
