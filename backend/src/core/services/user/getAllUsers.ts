import { Service, ServiceParams } from "../../../config/service";

//FIX: These are mock classes, structure of how user is mapped from application to core needs to be defined

export class GetAllUsers implements Service<ServiceParams, object>{
    async execute(input: ServiceParams): Promise<object> {
        return {};
    }
}