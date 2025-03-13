import { IDatasourceLearningObject } from "./IDatasourceLearningObject";

/**
 * Interface for representing a data source of the Dwengo-2 learning object backend.
 */
export interface IDatasource {
  /**
   * Retrieves the data source for learning objects.
   * @returns A promise that resolves to an instance of `IDatasourceLearningObject`.
   */
  getDatasourceLearningObject(): Promise<IDatasourceLearningObject>;
}
