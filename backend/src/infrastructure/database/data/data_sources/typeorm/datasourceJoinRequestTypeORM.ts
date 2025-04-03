import { DatasourceTypeORM } from "./datasourceTypeORM";
import { DatabaseEntryNotFoundError } from "../../../../../config/error";
import { JoinRequest, JoinRequestType } from "../../../../../core/entities/joinRequest";
import { JoinAsType, JoinRequestTypeORM } from "../../data_models/joinRequestTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";

export class DatasourceJoinRequestTypeORM extends DatasourceTypeORM {
    public async createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
        // Look up the id of the requester
        let id: string;

        if (joinRequest.type === JoinRequestType.TEACHER) {
            const teacher: TeacherTypeORM | null = await this.datasource.getRepository(TeacherTypeORM).findOne({
                where: { id: joinRequest.requester },
                relations: ["teacher"],
            });
            id = teacher?.teacher.id || "";
        } else {
            const student: StudentTypeORM | null = await this.datasource.getRepository(StudentTypeORM).findOne({
                where: { id: joinRequest.requester },
                relations: ["student"],
            });
            id = student?.student.id || "";
        }

        if (id === "") {
            throw new DatabaseEntryNotFoundError(`Student or teacher with id ${joinRequest.requester} not found`);
        }

        // Create partial object
        const joinRequestModel = this.datasource.getRepository(JoinRequestTypeORM).create({
            requester: { id: id },
            class: { id: joinRequest.classId },
            type: joinRequest.type === JoinRequestType.TEACHER ? JoinAsType.TEACHER : JoinAsType.STUDENT,
        });

        // Save that partial object
        // We do it this way since all the id's we're adding in this table already exist!
        // So we just want to add the id's instead of first fetching the user...
        await this.datasource.getRepository(JoinRequestTypeORM).save(joinRequestModel);

        return joinRequestModel.toJoinRequestEntity();
    }

    public async getJoinRequestById(id: string): Promise<JoinRequest | null> {
        const joinRequest: JoinRequestTypeORM | null = await this.datasource.getRepository(JoinRequestTypeORM).findOne({
            where: { id: id },
            relations: ["requester", "class"],
        });

        return joinRequest?.toJoinRequestEntity() || null;
    }

    public async getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]> {
        const joinRequests: JoinRequestTypeORM[] = await this.datasource.getRepository(JoinRequestTypeORM).find({
            where: { requester: { id: requesterId } },
            relations: ["requester", "class"],
        });

        return joinRequests.map(joinRequest => joinRequest.toJoinRequestEntity());
    }

    public async getJoinRequestByClassId(classId: string): Promise<JoinRequest[]> {
        const joinRequests: JoinRequestTypeORM[] = await this.datasource.getRepository(JoinRequestTypeORM).find({
            where: { class: { id: classId } },
            relations: ["requester", "class"],
        });

        return joinRequests.map(joinRequest => joinRequest.toJoinRequestEntity());
    }

    public async deleteJoinRequestById(id: string): Promise<void> {
        await this.datasource.getRepository(JoinRequestTypeORM).delete({ id: id });
    }
}
