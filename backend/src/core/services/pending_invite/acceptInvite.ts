import { Service, ServiceParams } from "../../../config/service";

export class AcceptInvite implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}