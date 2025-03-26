import { Service } from "../../../config/service";
import { IJoinRequestRepository } from "../../repositories/joinRequestRepositoryInterface";

export abstract class JoinRequestService<T> implements Service<T> {
    constructor(
        protected joinRequestRepository: IJoinRequestRepository,
    ) {}
    abstract execute(input: T): Promise<object>;
}
