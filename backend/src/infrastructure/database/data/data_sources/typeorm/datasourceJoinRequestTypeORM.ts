import { JoinRequest } from "../../../../../core/entities/joinRequest";
import { IDatasourceJoinRequest } from "../datasourceJoinRequestInterface";

export class DatasourceJoinRequestTypeORM extends IDatasourceJoinRequest {

    public async createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
        throw new Error("Method not implemented.");
    }

    public async getJoinRequestById(id: string): Promise<JoinRequest | null> {
        throw new Error("Method not implemented.");
    }

    public async getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]> {
        throw new Error("Method not implemented.");
    }

    public async getJoinRequestByClassId(classId: string): Promise<JoinRequest[]> {
        throw new Error("Method not implemented.");
    }

    public async deleteJoinRequestById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
