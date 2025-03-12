import { Service, ServiceParams } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";

export abstract class AssignmentService<T extends ServiceParams> implements Service<T> {
    constructor(protected assignmentRepository: IAssignmentRepository){}
    abstract execute(input: T): Promise<object>;
}