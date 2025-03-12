import { ApiError, ErrorCode } from '../../../application/types';
import { Service, ServiceParams } from '../../../config/service';
import { Class } from '../../entities/class';
import { JoinRequest, JoinRequestType } from '../../entities/joinRequest';
import { IClassRepository } from '../../repositories/classRepositoryInterface';
import { IJoinRequestRepository } from '../../repositories/joinRequestRepositoryInterface';

export class CreateJoinRequestParams implements ServiceParams {
  constructor(
    private _requesterId: string,
    private _classId: string,
    private _type: JoinRequestType,
  ) {}

  async fromObject(
    joinRequestRepository: IJoinRequestRepository,
    classRepository: IClassRepository,
  ): Promise<JoinRequest> {
    // Check if user hasn't already requested to join the class
    const classRequests: JoinRequest[] =
      await joinRequestRepository.getJoinRequestByClassId(this._classId);
    for (const req of classRequests) {
      if (req.requester == this._requesterId) {
        throw {
          code: ErrorCode.CONFLICT,
          message: 'User already has a join request for this class.',
        } as ApiError;
      }
    }

    // Check if user isn't already part of this class
    let classes: Class[];
    if (this._type === JoinRequestType.STUDENT) {
      classes = await classRepository.getAllClassesByStudentId(
        this._requesterId,
      );
    } else {
      classes = await classRepository.getAllClassesByTeacherId(
        this._requesterId,
      );
    }
    for (const c of classes) {
      if (this._classId === c.id!) {
        throw {
          code: ErrorCode.CONFLICT,
          message: 'User is already part of this class.',
        } as ApiError;
      }
    }
    return new JoinRequest(this._requesterId, this._classId, this._type);
  }
}

export class CreateJoinRequest implements Service<CreateJoinRequestParams> {
  constructor(
    private _joinRequestRepository: IJoinRequestRepository,
    private _classRepository: IClassRepository,
  ) {}

  async execute(input: CreateJoinRequestParams): Promise<object> {
    const joinRequest: JoinRequest =
      await this._joinRequestRepository.createJoinRequest(
        await input.fromObject(
          this._joinRequestRepository,
          this._classRepository,
        ),
      );

    await this._joinRequestRepository.createJoinRequest(joinRequest);
    return { id: joinRequest.id };
  }
}
