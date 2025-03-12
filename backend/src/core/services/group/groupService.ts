import { Service, ServiceParams } from "../../../config/service";
import { IGroupRepository } from "../../repositories/groupRepositoryInterface";

export abstract class GroupService<T extends ServiceParams> implements Service<T> {
  constructor(protected groupRepository: IGroupRepository) {}
  abstract execute(input: T): Promise<object>;
}
