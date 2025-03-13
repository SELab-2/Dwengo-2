import { ApiError, ErrorCode } from "../../../../src/application/types";
import { Class } from "../../../../src/core/entities/class";
import { JoinRequest, JoinRequestType } from "../../../../src/core/entities/joinRequest";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";
import { IJoinRequestRepository } from "../../../../src/core/repositories/joinRequestRepositoryInterface";
import { CreateJoinRequest, CreateJoinRequestParams } from "../../../../src/core/services/joinRequest";

describe('CreateJoinRequest', () => {
    let joinRequestRepository: jest.Mocked<IJoinRequestRepository>;
    let classRepository: jest.Mocked<IClassRepository>;
    let service: CreateJoinRequest;
  
    beforeEach(() => {
      joinRequestRepository = {
        createJoinRequest: jest.fn(),
        getJoinRequestById: jest.fn(),
        getJoinRequestByRequesterId: jest.fn(),
        getJoinRequestByClassId: jest.fn(),
        deleteJoinRequestById: jest.fn(),
      } as unknown as jest.Mocked<IJoinRequestRepository>;
  
      classRepository = {
        createClass: jest.fn(),
        updateClass: jest.fn(),
        getClassById: jest.fn(),
        getClassByName: jest.fn(),
        getAllClasses: jest.fn(),
        getUserClasses: jest.fn(),
        getAllClassesByTeacherId: jest.fn(),
        getAllClassesByStudentId: jest.fn(),
        deleteClassById: jest.fn(),
      } as unknown as jest.Mocked<IClassRepository>;
  
      service = new CreateJoinRequest(joinRequestRepository, classRepository);
    });
  
    it('should throw an error if user already has a join request for the class', async () => {
      const params = new CreateJoinRequestParams('user1', 'class1', JoinRequestType.STUDENT);
      joinRequestRepository.getJoinRequestByClassId.mockResolvedValue([
        new JoinRequest('user1', 'class1', JoinRequestType.STUDENT),
      ]);
  
      await expect(params.fromObject(joinRequestRepository, classRepository)).rejects.toEqual({
        code: ErrorCode.CONFLICT,
        message: 'User already has a join request for this class.',
      } as ApiError);
    });
  
    it('should throw an error if user is already part of the class', async () => {
      const params = new CreateJoinRequestParams('user1', 'class1', JoinRequestType.STUDENT);
      joinRequestRepository.getJoinRequestByClassId.mockResolvedValue([]);
      classRepository.getAllClassesByStudentId.mockResolvedValue([
        { id: 'class1' } as Class,
      ]);
  
      await expect(params.fromObject(joinRequestRepository, classRepository)).resolves.toEqual({
        "_classId": "class1",
        "_id": undefined,
        "_requester": "user1",
        "_type": "student"
      });
    });
  
    it('should create a join request successfully', async () => {
      const params = new CreateJoinRequestParams('user1', 'class1', JoinRequestType.STUDENT);
      joinRequestRepository.getJoinRequestByClassId.mockResolvedValue([]);
      classRepository.getAllClassesByStudentId.mockResolvedValue([]);
      joinRequestRepository.createJoinRequest.mockResolvedValue(new JoinRequest('user1', 'class1', JoinRequestType.STUDENT));
  
      const result = await service.execute(params);
  
      expect(result).toEqual({ id: undefined });
      expect(joinRequestRepository.createJoinRequest).toHaveBeenCalledTimes(1);
    });
  });