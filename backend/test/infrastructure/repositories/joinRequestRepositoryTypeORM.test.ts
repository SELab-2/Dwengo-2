import { JoinRequest, JoinRequestType } from "../../../src/core/entities/joinRequest";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { IDatasourceJoinRequest } from "../../../src/infrastructure/database/data/data_sources/datasourceJoinRequestInterface";

describe("JoinRequestRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let joinRequest: JoinRequest = new JoinRequest("teacherId", "classId", JoinRequestType.TEACHER, "id");

    let datasourceJoinRequest: IDatasourceJoinRequest;

    beforeEach(() => {
        datasourceMock = {
            getDatasourceAssignment: jest.fn(),
            getDatasourceSubmission: jest.fn(),
            getDatasourceMessage: jest.fn(),
            getDatasourceThread: jest.fn(),
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceJoinRequest = {
            createJoinRequest: jest.fn(() => Promise.resolve(joinRequest)),
            getJoinRequestById: jest.fn(() => Promise.resolve(joinRequest)),
            getJoinRequestByRequesterId: jest.fn(() => Promise.resolve([joinRequest, joinRequest])),
            getJoinRequestByClassId: jest.fn(() => Promise.resolve([joinRequest, joinRequest])),
            deleteJoinRequestById: jest.fn()        
        } as any;

    });

    test("createJoinRequest", async () => {
        // Call function from repository
        const returnJoinRequest: JoinRequest = await datasourceJoinRequest.createJoinRequest(joinRequest);
        
        expect(datasourceJoinRequest.createJoinRequest).toHaveBeenCalledTimes(1);
        expect(datasourceJoinRequest.createJoinRequest).toHaveBeenCalledWith(joinRequest);
        expect(returnJoinRequest).toEqual(joinRequest);
    });

    test("getJoinRequestById", async () => {
        // Call function from repository
        const returnJoinRequest: JoinRequest|null = await datasourceJoinRequest.getJoinRequestById(joinRequest.id!);
        
        expect(datasourceJoinRequest.getJoinRequestById).toHaveBeenCalledTimes(1);
        expect(datasourceJoinRequest.getJoinRequestById).toHaveBeenCalledWith(joinRequest.id);
        expect(returnJoinRequest).toEqual(joinRequest);
    });

    test("getJoinRequestByRequesterId", async () => {
        // Call function from repository
        const returnJoinRequests: JoinRequest[] = await datasourceJoinRequest.getJoinRequestByRequesterId(joinRequest.requester);
        
        expect(datasourceJoinRequest.getJoinRequestByRequesterId).toHaveBeenCalledTimes(1);
        expect(datasourceJoinRequest.getJoinRequestByRequesterId).toHaveBeenCalledWith(joinRequest.requester);
        expect(returnJoinRequests).toEqual([joinRequest, joinRequest]);
    });

    test("getJoinRequestByClassId", async () => {
        // Call function from repository
        const returnJoinRequests: JoinRequest[] = await datasourceJoinRequest.getJoinRequestByClassId(joinRequest.classId);
        
        expect(datasourceJoinRequest.getJoinRequestByClassId).toHaveBeenCalledTimes(1);
        expect(datasourceJoinRequest.getJoinRequestByClassId).toHaveBeenCalledWith(joinRequest.classId);
        expect(returnJoinRequests).toEqual([joinRequest, joinRequest]);
    });

    test("deleteJoinRequestById", async () => {
        // Call function from repository
        await datasourceJoinRequest.deleteJoinRequestById(joinRequest.id!);

        expect(datasourceJoinRequest.deleteJoinRequestById).toHaveBeenCalledTimes(1);
    });

});
