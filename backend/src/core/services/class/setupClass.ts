import { Service, ServiceParams } from "../../../config/service";

export class SetupClass implements Service<ServiceParams, object> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    //TODO
    return {};
  }
}