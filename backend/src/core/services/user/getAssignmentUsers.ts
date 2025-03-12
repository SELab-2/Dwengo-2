import { ServiceParams } from "../../../config/service";
import { UserBaseService } from "./userBaseService";

export class GetAssignmentUsersParams implements ServiceParams {
    constructor(private _assignmentId: string) { }

    public get assignmentId(): string {
        return this._assignmentId;
    }
}

export class GetAssignmentUsers extends UserBaseService<GetAssignmentUsersParams> {
    async execute(input: GetAssignmentUsersParams): Promise<object> {
        const students: object[] = (await this.studentRepository.getAssignmentStudents(input.assignmentId)).map(s => s.toObject());
        const teachers: object[] = (await this.teacherRepository.getAssignmentTeachers(input.assignmentId)).map(t => t.toObject());
        return { teachers: teachers, students: students };
    }
}
