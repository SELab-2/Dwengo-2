import { Service } from "../../../config/service";
import { IJoinCodeRepository } from "../../repositories/joinCodeRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export abstract class JoinCodeService<T> implements Service<T> {
    constructor(
        protected JoinCodeRepository: IJoinCodeRepository,
        protected userRepository: IUserRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
