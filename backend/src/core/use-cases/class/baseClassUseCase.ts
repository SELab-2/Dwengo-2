import { UseCase } from "../../../config/useCase";
import { IClassRepository } from "../../repositories/classRepositoryInterface";

/**
 * Class used for every usecase-implementation. They all need a class repository.
 */
export abstract class ClassBaseUseCase<T,P> implements UseCase<T, P>{
    constructor(protected classRepository: IClassRepository){}
    abstract execute(input: T):Promise<P>;
}