import { Service, ServiceParams } from "../../../config/service";

export class MakeAssignment implements Service<ServiceParams> {
  constructor() {}

  async execute(input: ServiceParams): Promise<object> {
    //TODO
    return {};
  }
}