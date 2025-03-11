import { Service, ServiceParams } from "../../../config/service";

export class SetupClass implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    //TODO
    return {};
  }
}