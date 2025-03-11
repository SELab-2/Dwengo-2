import { Service, ServiceParams } from '../../../config/service';

/**
 * Delete a user from the DB.
 */

export class DeleteUserParams implements ServiceParams {
  constructor(private _id: string) {}

  public get id(): string {
    return this._id;
  }
}

export abstract class DeleteUser implements Service<DeleteUserParams> {
  abstract deleteStudent(id: string): Promise<void>;

  /**
   * Delete a student from the DB.
   * @param params Parameters containing the ID of the student to delete.
   * @returns void
   * @throws Error if the student that will be deleted does not exist.
   */
  async execute(input: DeleteUserParams): Promise<object> {
    await this.deleteStudent(input.id);
    return {};
  }
}
