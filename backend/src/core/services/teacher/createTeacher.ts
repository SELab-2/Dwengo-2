import { Service, ServiceParams } from "../../../config/service";

export class CreateTeacher implements Service<ServiceParams, object> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}