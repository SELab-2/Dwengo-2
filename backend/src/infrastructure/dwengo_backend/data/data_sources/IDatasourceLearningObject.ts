import { LearningObject } from "../../../../core/entities/LearningObject";

/**
 * Interface for the datasource of the learning object
 */
export abstract class IDatasourceLearningObject {
  /**
   * Return the host of the datasource
   */
  public abstract get host(): string;

  /**
   * Return all learning objects
   */
  public abstract getLearningObjects(): Promise<LearningObject[]>;
}
