import { Service } from "../../../config/service";


export abstract class TaskService<T> implements Service<T> {
    constructor(
        
    ) {}
    abstract execute: (input: T) => Promise<object>;
    
}