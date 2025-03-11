import { ApiError, ErrorCode } from '../../../application/types';
import { Service } from '../../../config/service';

/**
 * Abstract class to get a student/teacher from DB
 */
export abstract class GetUser implements Service<string> {
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
  async execute(id: string): Promise<object> {
    if (!id || typeof id !== 'string') {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Invalid user id.',
      } as ApiError;
    }
    return await this.getUser(id);
  }
}