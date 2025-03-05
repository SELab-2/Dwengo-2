import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { JoinRequest } from "../entities/joinRequest";

export abstract class IJoinRequestRepoistory {

    /**
     * @param datasourceFactory Factory for creating datasources.
     */
    public constructor(
        protected datasourceFactory: IDatasourceFactory
    ) {}

    public abstract createJoinRequest(joinRequest: any): Promise<JoinRequest>;

    public abstract getJoinRequestById(id: string): Promise<JoinRequest>;

    public abstract getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]>;

    public abstract getJoinRequestByClassId(classId: string): Promise<JoinRequest[]>;

    public abstract deleteJoinRequestById(id: string): Promise<void>;
}
