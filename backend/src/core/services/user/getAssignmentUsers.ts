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
        const students: string[] = await this.studentRepository.getAssignmentStudents(input.assignmentId);
        const teachers: string[] = await this.teacherRepository.getAssignmentTeachers(input.assignmentId);
        return { teachers: teachers, students: students };
    }
}
