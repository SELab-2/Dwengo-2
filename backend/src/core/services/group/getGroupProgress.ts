import { Service } from "../../../config/service";

export class GetGroupProgress implements Service<object> {
    // TODO future feature?
    constructor() {}

    async execute(input: object): Promise<object> {
        return input;
    }
}
