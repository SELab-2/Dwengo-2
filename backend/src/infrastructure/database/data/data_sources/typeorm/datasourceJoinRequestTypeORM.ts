import { JoinRequest, JoinRequestType } from "../../../../../core/entities/joinRequest";
import { JoinAsType, JoinRequestTypeORM } from "../../data_models/joinRequestTypeorm";
import { IDatasourceJoinRequest } from "../datasourceJoinRequestInterface";
import { DatabaseEntryNotFoundError } from "../../../../../config/error";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";

export class DatasourceJoinRequestTypeORM extends IDatasourceJoinRequest {

    public async createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
        // Look up the id of the requester
        let id: string;

        if(joinRequest.getType() === JoinRequestType.TEACHER) {
            const teacher: TeacherTypeORM|null = await this.datasource
                .getRepository(TeacherTypeORM)
                .findOne({
                    where: {id: joinRequest.getRequester()},
                    relations: ["teacher"]
                });
            id = teacher?.teacher.id || "";
        } else {
            const student: StudentTypeORM|null = await this.datasource
                .getRepository(StudentTypeORM)
                .findOne({
                    where: {id: joinRequest.getRequester()},
                    relations: ["student"]
                });
            id = student?.student.id || "";
        }

        if(id === "") {
            throw new DatabaseEntryNotFoundError(`Student or teacher with id ${joinRequest.getRequester()} not found`);
        }

        // Create partial object
        const joinRequestModel = this.datasource
            .getRepository(JoinRequestTypeORM)
            .create({
                requester: {id: id},
                class: {id: joinRequest.getClassId()},
                type: joinRequest.getType() === JoinRequestType.TEACHER ? JoinAsType.TEACHER : JoinAsType.STUDENT
            });

        // Save that partial object
        // We do it this way since all the id's we're adding in this table already exist!
        // So we just want to add the id's instead of first fetching the user...
        await this.datasource.getRepository(JoinRequestTypeORM).save(joinRequestModel);

        return joinRequestModel.toJoinRequestEntity();
    }

    public async getJoinRequestById(id: string): Promise<JoinRequest | null> {
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
