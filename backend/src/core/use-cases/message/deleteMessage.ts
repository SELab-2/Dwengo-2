import { UseCase } from "../../../config/usecase";

export class DeleteMessage implements UseCase<undefined, undefined> {
  constructor() {}

  async execute(input: undefined): Promise<undefined> {
    //TODO
  }
}