import { ServiceParams } from "../../../config/service";
import { UserBaseService } from "./userBaseService";

export class GetGroupUsersParams implements ServiceParams {
    constructor(private _groupId: string) { }

    public get groupId(): string {
        return this._groupId;
    }
}

export class GetGroupUsers extends UserBaseService<GetGroupUsersParams> {
    async execute(input: GetGroupUsersParams): Promise<object> {
        const students: object[] = (await this.studentRepository.getGroupStudents(input.groupId)).map(s => s.toObject());
        const teachers: object[] = (await this.teacherRepository.getGroupTeachers(input.groupId)).map(t => t.toObject());
        return { teachers: teachers, students: students };
    }
}
