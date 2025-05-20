import { Service } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

/**
 * Abstract class for Assignment Services
 */
export abstract class AssignmentService<T> implements Service<T> {
    constructor(
        protected assignmentRepository: IAssignmentRepository,
        protected userRepository: IUserRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
