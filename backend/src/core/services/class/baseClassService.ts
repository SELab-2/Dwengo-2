import { Service, ServiceParams } from "../../../config/service";
import { IClassRepository } from "../../repositories/classRepositoryInterface";

/**
 * Class used for every usecase-implementation. They all need a class repository.
 */
export abstract class ClassBaseService<T extends ServiceParams,P> implements Service<T, object>{
    constructor(protected classRepository: IClassRepository){}
    abstract execute(input: T):Promise<object>;
}