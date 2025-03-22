import { DatabaseEntryNotFoundError, EntityNotFoundError } from "../../config/error";
import { JoinRequest } from "../../core/entities/joinRequest";
import { IJoinRequestRepository } from "../../core/repositories/joinRequestRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceJoinRequest } from "../database/data/data_sources/datasourceJoinRequestInterface";

export class JoinRequestRepositoryTypeORM extends IJoinRequestRepository {
    private datasource: IDatasource;
    private datasourceJoinRequest: Promise<IDatasourceJoinRequest>;

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceJoinRequest = this.datasource.getDatasourceJoinRequest();
    }

    public async create(joinRequest: JoinRequest): Promise<JoinRequest> {
        try {
            return await (await this.datasourceJoinRequest).createJoinRequest(joinRequest);
        } catch (error: unknown) {
            if (error instanceof DatabaseEntryNotFoundError) {
                throw new EntityNotFoundError(error.message);
            } else {
                throw error;
            }
        }
    }

    public async getById(id: string): Promise<JoinRequest> {
        const joinRequest: JoinRequest | null = await (await this.datasourceJoinRequest).getJoinRequestById(id);

        if (joinRequest) {
            return joinRequest;
        } else {
            throw new EntityNotFoundError(`Join request with id ${id} not found`);
        }
    }

    public async getByRequesterId(requesterId: string): Promise<JoinRequest[]> {
        return await (await this.datasourceJoinRequest).getJoinRequestByRequesterId(requesterId);
    }

    public async getByClassId(classId: string): Promise<JoinRequest[]> {
        return await (await this.datasourceJoinRequest).getJoinRequestByClassId(classId);
    }

    public async deleteById(id: string): Promise<void> {
        await (await this.datasourceJoinRequest).deleteJoinRequestById(id);
    }
}
