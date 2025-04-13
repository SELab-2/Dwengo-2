import { DatabaseEntryNotFoundError, EntityNotFoundError } from "../../config/error";
import { Class } from "../../core/entities/class";
import { JoinRequest, JoinRequestType } from "../../core/entities/joinRequest";
import { IJoinRequestRepository } from "../../core/repositories/joinRequestRepositoryInterface";
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

    public async createUsingCode(code: string, userId: string, type: JoinRequestType): Promise<JoinRequest> {
        const _class: Class = await this.datasourceClass.getClassByActiveCode(code);

        const joinRequest = new JoinRequest(userId, _class.id!, type);

        return this.create(joinRequest);
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
        const joinRequests: JoinRequest[] | null =
            await this.datasourceJoinRequest.getJoinRequestByRequesterId(requesterId);

        if (joinRequests) {
            return joinRequests;
        } else {
            throw new EntityNotFoundError(`Join requests for student or teacher with id ${requesterId} not found`);
        }
    }

    public async getByClassId(classId: string): Promise<JoinRequest[]> {
        return await this.datasourceJoinRequest.getJoinRequestByClassId(classId);
    }

    public async delete(id: string): Promise<void> {
        await this.datasourceJoinRequest.deleteJoinRequestById(id);
    }
}
