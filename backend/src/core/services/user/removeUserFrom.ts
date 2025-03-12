import { Service, ServiceParams } from '../../../config/service';
import { UserType } from '../../entities/user';

/**
 * Parameters required to remove a user from a group or class.
 *
 * @param _userId - The ID of the user to be removed.
 * @param _otherId - The ID of the group or class.
 * @param _userType - The type of the user (student or teacher).
 */

export class RemoveUserFromParams implements ServiceParams {
  constructor(
    private _userId: string,
    private _otherId: string,
    private _userType: UserType,
  ) {}

  get userId() {
    return this._userId;
  }

  get otherId() {
    return this._otherId;
  }

  get userType() {
    return this._userType;
  }
}

/**
 * @description Abstract class for removing a user from a group or class.
 *
 */
export abstract class RemoveUserFrom implements Service<RemoveUserFromParams> {
  public constructor() {}

  /** Function that calls the appropriate method of the repository.
   *
   * @param userId - The ID of the user to be removed.
   * @param otherId - The ID of the group or class.
   * @param userType - The type of the user (student or teacher).
   */
  abstract removeUser(
    userId: string,
    otherId: string,
    userType: UserType,
  ): Promise<void>;

  /**
   * Removes a user from a group/class.
   *
   * @param input the parameters to remove a user from a group or class.
   * @returns empty object no extra info needed.
   */
  async execute(input: RemoveUserFromParams): Promise<object> {
    await this.removeUser(input.userId, input.otherId, input.userType);
    return {};
  }
}
