import { Service, ServiceParams } from "../../../config/service";

export class CreateClass implements Service<ServiceParams, object> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}