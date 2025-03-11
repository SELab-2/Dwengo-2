import { Service, ServiceParams } from "../../../config/service";

export class InviteStudentToClass implements Service<ServiceParams, object> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}