import { JoinRequest } from "../../core/entities/joinRequest";
import { IJoinRequestRepoistory } from "../../core/repositories/joinRequestRepositoryInterface";

export class JoinRequestRepositoryTypeORM extends IJoinRequestRepoistory {

    public createJoinRequest(joinRequest: any): Promise<JoinRequest> {
        throw new Error("Method not implemented.");
    }

    public getJoinRequestById(id: string): Promise<JoinRequest> {
        throw new Error("Method not implemented.");
    }

    public getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]> {
        throw new Error("Method not implemented.");
    }

    public getJoinRequestByClassId(classId: string): Promise<JoinRequest[]> {
        throw new Error("Method not implemented.");
    }

    public deleteJoinRequestById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
