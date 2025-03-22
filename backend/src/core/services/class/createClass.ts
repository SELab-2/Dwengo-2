import { ClassBaseService } from "./baseClassService";
import { ServiceParams } from "../../../config/service";
import { Class } from "../../entities/class";

export class CreateClassParams implements ServiceParams {
    constructor(
        private _name: string,
        private _description: string,
        private _targetAudience: string,
        private _teacherId: string,
    ) {}

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get targetAudience(): string {
        return this._targetAudience;
    }

    get teacherId(): string {
        return this._teacherId;
    }
}

export class CreateClass extends ClassBaseService<CreateClassParams> {
    async execute(input: CreateClassParams): Promise<object> {
        const newClass = new Class(input.name, input.description, input.targetAudience, input.teacherId);
        return { id: (await this.classRepository.create(newClass)).id };
    }
}
