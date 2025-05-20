import { Service } from "../../../config/service";
import { IClassRepository } from "../../repositories/classRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

/**
 * Class used for every service-implementation. They all need a class repository.
 */
export abstract class ClassBaseService<T> implements Service<T> {
    constructor(
        protected classRepository: IClassRepository,
        protected userRepository: IUserRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
