import { Service } from "../../../config/service";
import { IJoinCodeRepository } from "../../repositories/joinCodeRepositoryInterface";

export abstract class JoinCodeService<T> implements Service<T> {
    constructor(protected JoinCodeRepository: IJoinCodeRepository) {}
    abstract execute(input: T): Promise<object>;
}
