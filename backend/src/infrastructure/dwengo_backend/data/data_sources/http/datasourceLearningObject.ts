import { LearningObject } from "../../../../../core/entities/LearningObject";
import { IDatasourceLearningObject } from "../IDatasourceLearningObject";

export class DatasourceLearningObject extends IDatasourceLearningObject {
  public constructor(
    private readonly _host: string = "https://dwengo.org/backend",
  ) {
    super();
  }

  public get host(): string { return this._host; }

  public async getLearningObjects(): Promise<LearningObject[]> {
    const response = await fetch(`${this.host}/api/learningObjects/search`);
    return await response.json();
  }
}
