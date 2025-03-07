import { JoinRequest } from "../../core/entities/joinRequest";
import { IJoinRequestRepoistory } from "../../core/repositories/joinRequestRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceJoinRequest } from "../database/data/data_sources/datasourceJoinRequestInterface";

export class JoinRequestRepositoryTypeORM extends IJoinRequestRepoistory {

    private datasource: IDatasource;
    private datasourceJoinRequest: Promise<IDatasourceJoinRequest>

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceJoinRequest = this.datasource.getDatasourceJoinRequest();
    }

    public async createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
        return await (await this.datasourceJoinRequest).createJoinRequest(joinRequest);
    }

    public async getJoinRequestById(id: string): Promise<JoinRequest> {
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
