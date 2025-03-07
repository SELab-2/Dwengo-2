import { DatabaseEntryNotFoundError, EntityNotFoundError } from "../../config/error";
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
        try {
            return await (await this.datasourceJoinRequest).createJoinRequest(joinRequest);
        } catch(error: unknown) {
            if(error instanceof DatabaseEntryNotFoundError) {
                throw new EntityNotFoundError(error.message);
            }
            else {
                throw error;
            }
        }
    }

    public async getJoinRequestById(id: string): Promise<JoinRequest> {
        const joinRequest: JoinRequest|null = await (await this.datasourceJoinRequest).getJoinRequestById(id);

        if(joinRequest) {
            return joinRequest;
        } else {
            throw new EntityNotFoundError(`Join request with id ${id} not found`);
        }
    }

    public async getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]> {
        return await (await this.datasourceJoinRequest).getJoinRequestByRequesterId(requesterId);
    }

    public async getJoinRequestByClassId(classId: string): Promise<JoinRequest[]> {
        return await (await this.datasourceJoinRequest).getJoinRequestByClassId(classId);
    }

    public async deleteJoinRequestById(id: string): Promise<void> {
        await (await this.datasourceJoinRequest).deleteJoinRequestById(id);
    }

}
