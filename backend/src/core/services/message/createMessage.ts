import { Service, ServiceParams } from "../../../config/service";

export class CreateMessage implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}