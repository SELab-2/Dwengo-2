import { Service, ServiceParams } from "../../../config/service";

export class GetMessage implements Service<ServiceParams, object> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}