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
        const students: object[] = (await this.studentRepository.getClassStudents(input.classId)).map(s => s.toObject());
        const teachers: object[] = (await this.teacherRepository.getClassTeachers(input.classId)).map(t => t.toObject());
        return { teachers: teachers, students: students };
    }
}