import { ApiError, ErrorCode } from '../../../application/types';
import { Service, ServiceParams } from '../../../config/service';

export class GetUserParams implements ServiceParams {
  constructor(private _id: string) {}

  public get id() {
    return this._id;
  }
}

/**
 * Abstract class to get a student/teacher from DB
 */
export abstract class GetUser implements Service<GetUserParams> {
  /**
   * Abstract function to retrieve a student/teachter from DB.
   *
   * @param id of the user to get from the DB.
   * @returns object with the info of the user.
   */
  public abstract getUser(id: string): Promise<object>;
  /**
   * Gets a user from the DB.
   *
   * @param id ID of the user to get from the DB.
   * @returns the student with the given id.
   *
   * @throws ApiError if id is invalid.
   */
  async execute(input: GetUserParams): Promise<object> {
    return await this.getUser(input.id);
  }
}