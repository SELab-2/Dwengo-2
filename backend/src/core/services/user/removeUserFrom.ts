import { Service, ServiceParams } from '../../../config/service';
import { User, UserType } from '../../entities/user';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { RemoveStudentFromParams } from '../student/removeStudentFrom';

// Class to be used by execute methode
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

// Abstract class for RemoveStudentFromGroup and RemoveStudentFromClass
export abstract class RemoveUserFrom implements Service<RemoveUserFromParams> {
  public constructor() {}

  /**
   * Function that calls the right method of repository.
   *
   * @param userId id of user to be removed.
   * @param otherId id of group/class.
   */
  abstract removeUser(
    userId: string,
    otherId: string,
    userType: UserType,
  ): void;

  /**
   * Removes a user from a group/class.
   *
   * @param input object containing userId and otherId.
   * @returns empty object no extra info needed.
   *
   */
  async execute(input: RemoveUserFromParams): Promise<object> {
    await this.removeUser(input.userId, input.otherId, input.userType);
    return {};
  }
}
