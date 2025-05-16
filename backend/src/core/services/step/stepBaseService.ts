import { Service } from "../../../config/service";
import { IStepRepository } from "../../repositories/stepRepositoryInterface";

/**
 * Base class for step services.
 */
export abstract class StepBaseService<T> implements Service<T> {
    constructor(protected stepRepository: IStepRepository) {}
    abstract execute(input: T): Promise<object>;
}
