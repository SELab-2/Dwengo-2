import { Service, ServiceParams } from "../../../config/service";

export class GetQuestionThread implements Service<ServiceParams, object> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}
