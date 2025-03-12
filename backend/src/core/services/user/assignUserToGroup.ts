import { Service, ServiceParams } from "../../../config/service";

export class AssignUserToGroup implements Service<ServiceParams> {
    async execute(input: ServiceParams): Promise<object> {
        return {};
    }
}