import { Service, ServiceParams } from "../../../config/service";
import { UserBaseService } from "./userBaseService";

export class GetClassUsersParams implements ServiceParams {
    constructor(private _classId: string) { }

    public get classId(): string {
        return this._classId;
    }
}

export class GetClassUsers extends UserBaseService<GetClassUsersParams> {
    async execute(input: GetClassUsersParams): Promise<object> {
        const students: string[] = await this.studentRepository.getClassStudents(input.classId);
        const teachers: string[] = await this.teacherRepository.getClassTeacher(input.classId);
        return { teachers: teachers, students: students };
    }
}