import { DataSource } from "typeorm";
import { JoinRequest } from "../../../../core/entities/joinRequest";

export abstract class IDatasourceJoinRequest {

    public constructor(
        protected datasource: DataSource
    ) {}

    public abstract createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest>;

    public abstract getJoinRequestById(id: string): Promise<JoinRequest|null>;

    public abstract getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]>;

    public abstract getJoinRequestByClassId(classId: string): Promise<JoinRequest[]>;

    public abstract deleteJoinRequestById(id: string): Promise<void>;

}
