import { Service, ServiceParams } from "../../../config/service";

export class GetGroupProgress implements Service<ServiceParams> { // future feature?
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}