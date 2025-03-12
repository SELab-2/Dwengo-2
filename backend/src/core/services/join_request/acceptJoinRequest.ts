import { Service, ServiceParams } from "../../../config/service";

export class AcceptJoinRequest implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}