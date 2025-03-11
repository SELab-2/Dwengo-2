import { Service, ServiceParams } from "../../../config/service";

export class GetQuestionMessages implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    return {};
  }
}
