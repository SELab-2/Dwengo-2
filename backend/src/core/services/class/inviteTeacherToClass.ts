import { Service, ServiceParams } from "../../../config/service";

export class InviteTeacherToClass implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}