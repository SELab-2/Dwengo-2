import { Service, ServiceParams } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export class AssignStudentToGroupParams implements ServiceParams {
    constructor(
        private _studentId: string,
        private _groupId: string,
    ) {}

    public get studentId(): string {
        return this._studentId;
    }

    public get groupId(): string {
        return this._groupId;
    }
}

export class AssignStudentToGroup implements Service<AssignStudentToGroupParams> {
    constructor(private studentRepository: IStudentRepository) {}
    async execute(input: AssignStudentToGroupParams): Promise<object> {
        await this.studentRepository.assignToGroup(input.studentId, input.groupId);
        return {};
    }
}
