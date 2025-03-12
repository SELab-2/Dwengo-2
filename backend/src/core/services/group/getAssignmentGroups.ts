import { Service, ServiceParams } from '../../../config/service';

export class GetAssignmentGroups implements Service<ServiceParams> {
    async execute(input: ServiceParams): Promise<object>{
        return {};
    };	
}