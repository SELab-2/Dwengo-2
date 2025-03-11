import { Service, ServiceParams } from "../../../config/service";

export class CreateTeacher implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}