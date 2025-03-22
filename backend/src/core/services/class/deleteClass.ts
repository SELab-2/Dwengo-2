import { ClassBaseService } from "./baseClassService";
import { ServiceParams } from "../../../config/service";

export class DeleteClassParams implements ServiceParams {
    constructor(
        private _id: string, //id of the class to delete
    ) {}

    public get id(): string {
        return this._id;
    }
}

export class DeleteClass extends ClassBaseService<DeleteClassParams> {
    async execute(input: DeleteClassParams): Promise<object> {
        await this.classRepository.deleteById(input.id);
        return {};
    }
}
