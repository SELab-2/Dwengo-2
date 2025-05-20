import { Service } from "../../../config/service";
import { IClassRepository } from "../../repositories/classRepositoryInterface";

/**
 * Class used for every service-implementation. They all need a class repository.
 */
export abstract class ClassBaseService<T> implements Service<T> {
    constructor(protected classRepository: IClassRepository) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
