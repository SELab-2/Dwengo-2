import { DatabaseEntryNotFoundError, EntityNotFoundError } from "../../config/error";
import { JoinRequest } from "../../core/entities/joinRequest";
import { IJoinRequestRepository } from "../../core/repositories/joinRequestRepositoryInterface";
import { DatasourceJoinRequestTypeORM } from "../database/data/data_sources/typeorm/datasourceJoinRequestTypeORM";

export class JoinRequestRepositoryTypeORM extends IJoinRequestRepository {
    private datasourceJoinRequest: DatasourceJoinRequestTypeORM;

    public constructor() {
        super();
        this.datasourceJoinRequest = new DatasourceJoinRequestTypeORM();
    }

    public async create(joinRequest: JoinRequest): Promise<JoinRequest> {
        try {
            return await this.datasourceJoinRequest.createJoinRequest(joinRequest);
        } catch (error: unknown) {
            if (error instanceof DatabaseEntryNotFoundError) {
                throw new EntityNotFoundError(error.message);
            } else {
                throw error;
            }
        }
    }

    public async getById(id: string): Promise<JoinRequest> {
        const joinRequest: JoinRequest | null = await this.datasourceJoinRequest.getJoinRequestById(id);

        if (joinRequest) {
            return joinRequest;
        } else {
            throw new EntityNotFoundError(`Join request with id ${id} not found`);
        }
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
