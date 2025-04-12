import { ApiError, ErrorCode } from "../../../../../src/application/types";
import { JoinRequest, JoinRequestType } from "../../../../../src/core/entities/joinRequest";
import { IJoinRequestRepository } from "../../../../../src/core/repositories/joinRequestRepositoryInterface";
import {
    GetUserJoinRequests,
    GetJoinRequest,
    GetUserJoinRequestsInput,
    GetJoinRequestInput,
} from "../../../../../src/core/services/joinRequest/getJoinRequest";

describe("GetUserJoinRequests Service", () => {
    let getJoinRequestsService: GetUserJoinRequests;
    let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
    let input: GetUserJoinRequestsInput;

    beforeEach(() => {
        mockJoinRequestRepository = {
            getByRequesterId: jest.fn(),
        } as unknown as jest.Mocked<IJoinRequestRepository>;

        getJoinRequestsService = new GetUserJoinRequests(mockJoinRequestRepository);

        input = {
            idParent: "user1",
        };
    });

    test("Should return all join requests for a user", async () => {
        const joinRequests: JoinRequest[] = [
            new JoinRequest("user1", "class1", JoinRequestType.STUDENT, "1"),
            new JoinRequest("user1", "class2", JoinRequestType.TEACHER, "2"),
        ];

        mockJoinRequestRepository.getByRequesterId.mockResolvedValue(joinRequests);

        await expect(getJoinRequestsService.execute(input)).resolves.toEqual({
            requests: joinRequests.map(request => request.id),
        });
        expect(mockJoinRequestRepository.getByRequesterId).toHaveBeenCalledWith(input.idParent);
    });
});

describe("GetJoinRequest Service", () => {
    let getJoinRequestService: GetJoinRequest;
    let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
    let input: GetJoinRequestInput;

    beforeEach(() => {
        mockJoinRequestRepository = {
            getById: jest.fn(),
            getByRequesterId: jest.fn(),
        } as unknown as jest.Mocked<IJoinRequestRepository>;

        getJoinRequestService = new GetJoinRequest(mockJoinRequestRepository);

        input = {
            id: "1",
        };
    });

    test("Should return a single join request for a user", async () => {
        const joinRequests: JoinRequest[] = [
            new JoinRequest("user1", "class1", JoinRequestType.TEACHER, "1"),
            new JoinRequest("user1", "class2", JoinRequestType.STUDENT, "2"),
        ];

        mockJoinRequestRepository.getById.mockResolvedValue(joinRequests[0]);

        await expect(getJoinRequestService.execute(input)).resolves.toEqual(joinRequests[0].toObject());
        expect(mockJoinRequestRepository.getById).toHaveBeenCalledWith(input.id);
    });
});
