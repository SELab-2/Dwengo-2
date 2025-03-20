import { AssignmentService } from "./assignmentService";
import { Assignment } from "../../entities/assignment";
import { z } from "zod";
import { getUserAssignmentsSchema } from "./assignmentSchemas";

type GetUserAssignmentsInput = z.infer<typeof getUserAssignmentsSchema>;

/**
 * Service class to get all assignments of a user.
 */
export class GetUserAssignments extends AssignmentService<GetUserAssignmentsInput> {
    async execute(input: GetUserAssignmentsInput): Promise<object> {
        const assignments: Assignment[] = await this.assignmentRepository.getAssignmentsByUserId(input.id);
        return { assignments: assignments.map(assignment => assignment.toObject()) };
    }
}
