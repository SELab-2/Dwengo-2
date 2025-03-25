import { Service } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";

/**
 * Abstract class for Assignment Services
 */
export abstract class AssignmentService<T> implements Service<T> {
    constructor(protected assignmentRepository: IAssignmentRepository) {}
    abstract execute(input: T): Promise<object>;
}
