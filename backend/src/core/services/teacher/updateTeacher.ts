import { Service, ServiceParams } from "../../../config/service";

export class UpdateTeacher implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}