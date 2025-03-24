import { z } from "zod";
import { AssignmentService } from "./assignmentService";
import { getUserAssignmentsSchema } from "../../../application/schemas/assignmentSchemas";
import { Assignment } from "../../entities/assignment";

export type GetUserAssignmentsInput = z.infer<typeof getUserAssignmentsSchema>;

/**
 * Service class to get all assignments of a user.
 */
export class GetUserAssignments extends AssignmentService<GetUserAssignmentsInput> {
    async execute(input: GetUserAssignmentsInput): Promise<object> {
        const assignments: Assignment[] = await this.assignmentRepository.getAssignmentsByUserId(input.idParent);
        return { assignments: assignments.map(assignment => assignment.toObject()) };
    }
}
