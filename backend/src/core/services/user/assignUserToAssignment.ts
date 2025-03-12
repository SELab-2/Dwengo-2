import { ServiceParams } from "../../../config/service";
import { UserType } from "../../entities/user";
import { UserBaseService } from "./userBaseService";

export class AssignUserToAssignmentParams implements ServiceParams {
    constructor(
        private _userId: string,
        private _otherId: string,
        private _type: UserType
    ) { }

    public get userId(): string {
        return this._userId;
    }

    // The other ID could be both a 
    public get otherId(): string {
        return this._otherId;
    }

    public get type(): UserType {
        return this._type;
    }
}

export class AssignUserToAssignment extends UserBaseService<AssignUserToAssignmentParams> {
    async execute(input: AssignUserToAssignmentParams): Promise<object> {

        if (input.type === UserType.TEACHER) {
            await this.teacherRepository.assignTeacherToAssignment(input.userId, input.otherId);
        } else {
            await this.studentRepository.assignStudentToAssignment(input.userId, input.otherId);
        }

        return {};
    }
}