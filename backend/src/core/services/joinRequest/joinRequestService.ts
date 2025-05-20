import { Service } from "../../../config/service";
import { IJoinRequestRepository } from "../../repositories/joinRequestRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export abstract class JoinRequestService<T> implements Service<T> {
    constructor(
        protected joinRequestRepository: IJoinRequestRepository,
        protected userRepository: IUserRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
