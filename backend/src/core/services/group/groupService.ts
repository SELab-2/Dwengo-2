import { Service } from "../../../config/service";
import { IGroupRepository } from "../../repositories/groupRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export abstract class GroupService<T> implements Service<T> {
    constructor(
        protected groupRepository: IGroupRepository,
        protected userRepository: IUserRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
