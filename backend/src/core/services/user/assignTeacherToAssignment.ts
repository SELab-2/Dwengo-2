import { Service, ServiceParams } from "../../../config/service";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";
import { UserBaseService } from "./userBaseService";

export class AssignTeacherToAssignmentParams implements ServiceParams {
    constructor(
        private _teacherId: string,
        private _assignmentId: string,
    ) { }

    public get teacherId(): string {
        return this._teacherId;
    }

    // The other ID should be a groupId for a student and an assignmentId for a teacher.
    public get assignmentId(): string {
        return this._assignmentId;
    }

}

//Only a teacher should be assigned to the assignment itself, a student will always be assigned to a group within the assignment
export class AssignTeacherToAssignment implements Service<AssignTeacherToAssignmentParams> {

    constructor(
        private teacherRepository: ITeacherRepository
    ) { }

    async execute(input: AssignTeacherToAssignmentParams): Promise<object> {

        await this.teacherRepository.assignTeacherToAssignment(input.teacherId, input.assignmentId);

        return {};
    }
}