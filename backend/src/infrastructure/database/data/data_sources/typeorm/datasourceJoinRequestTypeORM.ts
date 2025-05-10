import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { JoinRequest, JoinRequestType } from "../../../../../core/entities/joinRequest";
import { JoinAsType, JoinRequestTypeORM } from "../../data_models/joinRequestTypeorm";

export class DatasourceJoinRequestTypeORM extends DatasourceTypeORM {
    public async createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // Create partial object
        const joinRequestModel = datasource.getRepository(JoinRequestTypeORM).create({
            requester: { id: joinRequest.requester },
            class: { id: joinRequest.classId },
            type: joinRequest.type === JoinRequestType.TEACHER ? JoinAsType.TEACHER : JoinAsType.STUDENT,
        });

        // Save that partial object
        // We do it this way since all the id's we're adding in this table already exist!
        // So we just want to add the id's instead of first fetching the user...
        await datasource.getRepository(JoinRequestTypeORM).save(joinRequestModel);

        return joinRequestModel.toJoinRequestEntity();
    }

    public async getJoinRequestById(id: string): Promise<JoinRequest> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinRequest: JoinRequestTypeORM | null = await datasource.getRepository(JoinRequestTypeORM).findOne({
            where: { id: id },
            relations: ["requester", "class"],
        });
        if (!joinRequest) {
            throw new EntityNotFoundError(`Join request with id ${id} not found`);
        }

        return joinRequest.toJoinRequestEntity();
    }

    public async getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinRequests: JoinRequestTypeORM[] = await datasource.getRepository(JoinRequestTypeORM).find({
            where: { requester: { id: requesterId } },
            relations: ["requester", "class"],
        });

        for (const joinRequest of joinRequests) {
            joinRequest.requester.id = requesterId;
        }

        return joinRequests.map(joinRequest => joinRequest.toJoinRequestEntity());
    }

    public async getJoinRequestByClassId(classId: string): Promise<JoinRequest[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinRequests: JoinRequestTypeORM[] = await datasource.getRepository(JoinRequestTypeORM).find({
            where: { class: { id: classId } },
            relations: ["requester", "class"],
        });

        return joinRequests.map(joinRequest => joinRequest.toJoinRequestEntity());
    }

    public async deleteJoinRequestById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        await datasource.getRepository(JoinRequestTypeORM).delete({ id: id });
    }
}
