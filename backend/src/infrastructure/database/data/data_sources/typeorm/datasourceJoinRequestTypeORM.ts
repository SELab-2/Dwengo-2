import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { JoinRequest, JoinRequestType } from "../../../../../core/entities/joinRequest";
import { JoinAsType, JoinRequestTypeORM } from "../../data_models/joinRequestTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";

export class DatasourceJoinRequestTypeORM extends DatasourceTypeORM {
    public async createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        // Look up the id of the requester
        let id: string;

        if (joinRequest.type === JoinRequestType.TEACHER) {
            const teacher: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
                where: { id: joinRequest.requester },
                relations: ["teacher"],
            });
            if (!teacher) {
                throw new EntityNotFoundError(`Teacher with id ${joinRequest.requester} not found`);
            }
            id = teacher.teacher.id;
        } else {
            const student: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
                where: { id: joinRequest.requester }, // requester is the id of the user. Match the user in the student table
                relations: ["student"],
            });
            if (!student) {
                throw new EntityNotFoundError(`Student with id ${joinRequest.requester} not found`);
            }
            id = student.student.id;
        }

        // Create partial object
        const joinRequestModel = datasource.getRepository(JoinRequestTypeORM).create({
            requester: { id: id },
            class: { id: joinRequest.classId },
            type: joinRequest.type === JoinRequestType.TEACHER ? JoinAsType.TEACHER : JoinAsType.STUDENT,
        });

        // Save that partial object
        // We do it this way since all the id's we're adding in this table already exist!
        // So we just want to add the id's instead of first fetching the user...
        await datasource.getRepository(JoinRequestTypeORM).save(joinRequestModel);

        return joinRequestModel.toJoinRequestEntity();
    }

    public async getJoinRequestById(id: string): Promise<JoinRequest | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinRequest: JoinRequestTypeORM | null = await datasource.getRepository(JoinRequestTypeORM).findOne({
            where: { id: id },
            relations: ["requester", "class"],
        });
        if (!joinRequest) {
            return null;
        }

        let userId: string;

        if (joinRequest.type === JoinAsType.STUDENT) {
            const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
                where: { student: joinRequest.requester },
            });

            userId = studentModel!.id;
        } else {
            const teacherModel: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
                where: { teacher: joinRequest.requester },
            });

            userId = teacherModel!.id;
        }

        if (!userId) {
            return null;
        }

        joinRequest.requester.id = userId;

        return joinRequest.toJoinRequestEntity();
    }

    public async getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[] | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        let userId: string;

        const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: requesterId },
            relations: ["student"],
        });

        const teacherModel: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
            where: { id: requesterId },
            relations: ["teacher"],
        });

        if (studentModel) {
            userId = studentModel?.student.id;
        } else if (teacherModel) {
            userId = teacherModel?.teacher.id;
        } else {
            return null;
        }

        const joinRequests: JoinRequestTypeORM[] = await datasource.getRepository(JoinRequestTypeORM).find({
            where: { requester: { id: userId } },
            relations: ["requester", "class"],
        });

        for (const joinRequest of joinRequests) {
            joinRequest.requester.id = requesterId;
        }

        return joinRequests.map(joinRequest => joinRequest.toJoinRequestEntity());
    }

    public async getJoinRequestByClassId(classId: string): Promise<JoinRequest[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinRequests: JoinRequestTypeORM[] = await datasource.getRepository(JoinRequestTypeORM).find({
            where: { class: { id: classId } },
            relations: ["requester", "class"],
        });

        return joinRequests.map(joinRequest => joinRequest.toJoinRequestEntity());
    }

    public async deleteJoinRequestById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        await datasource.getRepository(JoinRequestTypeORM).delete({ id: id });
    }
}
