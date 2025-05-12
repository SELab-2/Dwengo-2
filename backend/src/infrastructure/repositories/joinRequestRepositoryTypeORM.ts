import { JoinRequest, JoinRequestType } from "../../core/entities/joinRequest";
import { IJoinRequestRepository } from "../../core/repositories/joinRequestRepositoryInterface";
import { ClassTypeORM as Class } from "../database/data/data_models/classTypeorm";
import { DatasourceClassTypeORM } from "../database/data/data_sources/typeorm/datasourceClassTypeORM";
import { DatasourceJoinRequestTypeORM } from "../database/data/data_sources/typeorm/datasourceJoinRequestTypeORM";

export class JoinRequestRepositoryTypeORM extends IJoinRequestRepository {
    private datasourceJoinRequest: DatasourceJoinRequestTypeORM;
    private datasourceClass: DatasourceClassTypeORM;

    public constructor() {
        super();
        this.datasourceJoinRequest = new DatasourceJoinRequestTypeORM();
        this.datasourceClass = new DatasourceClassTypeORM();
    }

    public async create(joinRequest: JoinRequest): Promise<JoinRequest> {
        return await this.datasourceJoinRequest.createJoinRequest(joinRequest);
    }

    public async createUsingCode(code: string, userId: string, type: JoinRequestType): Promise<JoinRequest> {
        const _class: Class = await this.datasourceClass.getClassByActiveCode(code);

        const joinRequest = new JoinRequest(userId, _class.id!, type);

        return this.create(joinRequest);
    }

    public async getById(id: string): Promise<JoinRequest> {
        return await this.datasourceJoinRequest.getJoinRequestById(id);
    }

    public async getByRequesterId(requesterId: string): Promise<JoinRequest[]> {
        return await this.datasourceJoinRequest.getJoinRequestByRequesterId(requesterId);
    }

    public async getByClassId(classId: string): Promise<JoinRequest[]> {
        return await this.datasourceJoinRequest.getJoinRequestByClassId(classId);
    }

    public async delete(id: string): Promise<void> {
        await this.datasourceJoinRequest.deleteJoinRequestById(id);
    }
}
