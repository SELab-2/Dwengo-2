import { JoinRequest, JoinRequestType } from "../../../../../core/entities/joinRequest";
import { JoinAsType, JoinRequestTypeORM } from "../../data_models/joinRequestTypeorm";
import { IDatasourceJoinRequest } from "../datasourceJoinRequestInterface";

export class DatasourceJoinRequestTypeORM extends IDatasourceJoinRequest {

    public async createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
        // Create partial object
        const joinRequestModel = this.datasource
            .getRepository(JoinRequestTypeORM)
            .create({
                requester: { id: joinRequest.getRequester() },
                class: { id: joinRequest.getClassId() },
                type: joinRequest.getType() === JoinRequestType.TEACHER ? JoinAsType.TEACHER : JoinAsType.STUDENT
            });

        // Save that partial object
        await this.datasource.getRepository(JoinRequestTypeORM).save(joinRequestModel);

        // We do it this way since all the id's we're adding in this table already exist!
        // So we just want to add the id's instead of first fetching the user...

        return joinRequestModel.toJoinRequestEntity();
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
