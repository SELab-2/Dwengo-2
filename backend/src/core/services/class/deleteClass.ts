import { Service, ServiceParams } from "../../../config/service";

export class DeleteClass implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}