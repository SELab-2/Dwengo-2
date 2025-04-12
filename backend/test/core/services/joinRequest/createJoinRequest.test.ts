import { ApiError, ErrorCode } from "../../../../src/application/types";
import { Class } from "../../../../src/core/entities/class";
import { JoinRequest, JoinRequestType } from "../../../../src/core/entities/joinRequest";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";
import { IJoinRequestRepository } from "../../../../src/core/repositories/joinRequestRepositoryInterface";
import { CreateJoinRequest, CreateJoinRequestInput } from "../../../../src/core/services/joinRequest";

describe("CreateJoinRequest", () => {
    let joinRequestRepository: jest.Mocked<IJoinRequestRepository>;
    let classRepository: jest.Mocked<IClassRepository>;
    let service: CreateJoinRequest;
    let input: CreateJoinRequestInput;

    beforeEach(() => {
        joinRequestRepository = {
            create: jest.fn(),
            getById: jest.fn(),
            getByRequesterId: jest.fn(),
            getByClassId: jest.fn(),
            deleteById: jest.fn(),
        } as unknown as jest.Mocked<IJoinRequestRepository>;

        classRepository = {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
            getByName: jest.fn(),
            getAll: jest.fn(),
            getByUserId: jest.fn(),
            getByTeacherId: jest.fn(),
            getByStudentId: jest.fn(),
            deleteById: jest.fn(),
        } as unknown as jest.Mocked<IClassRepository>;

        service = new CreateJoinRequest(joinRequestRepository, classRepository);
        input = {
            requester: "user1",
            class: "class1",
            userType: JoinRequestType.STUDENT,
        };
    });

    it("should throw an error if user already has a join request for the class", async () => {
        joinRequestRepository.getByClassId.mockResolvedValue([
            new JoinRequest("user1", "class1", JoinRequestType.STUDENT),
        ]);

        await expect(service.execute(input)).rejects.toEqual({
            code: ErrorCode.CONFLICT,
            message: "User already has a join request for this class.",
        } as ApiError);
    });

    //TODO: needs query in repository (check services)
    // it('should throw an error if user is already part of the class', async () => {
    //   joinRequestRepository.getJoinRequestByClassId.mockResolvedValue([]);
    //   classRepository.getAllClassesByStudentId.mockResolvedValue([
    //     { id: 'class1' } as Class,
    //   ]);
    //
    //   await expect(service.execute(input)).resolves.toEqual({
    //     "_classId": "class1",
    //     "_id": undefined,
    //     "_requester": "user1",
    //     "_type": "student"
    //   });
    // });

    it("should create a join request successfully", async () => {
        joinRequestRepository.getByClassId.mockResolvedValue([]);
        classRepository.getByStudentId.mockResolvedValue([]);
        joinRequestRepository.create.mockResolvedValue(new JoinRequest("user1", "class1", JoinRequestType.STUDENT));

        const result = await service.execute(input);

        expect(result).toEqual({ id: undefined });
        expect(joinRequestRepository.create).toHaveBeenCalledTimes(1);
    });
});
