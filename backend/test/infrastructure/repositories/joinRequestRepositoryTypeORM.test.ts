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
            getDatasourceTeacher: jest.fn(),
            getDatasourceClass: jest.fn(),
            getDatasourceJoinRequest: jest.fn(),
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
        const returnJoinRequest: JoinRequest|null = await datasourceJoinRequest.getJoinRequestById(joinRequest.getId()!);
        
        expect(datasourceJoinRequest.getJoinRequestById).toHaveBeenCalledTimes(1);
        expect(datasourceJoinRequest.getJoinRequestById).toHaveBeenCalledWith(joinRequest.getId());
        expect(returnJoinRequest).toEqual(joinRequest);
    });

    test("getJoinRequestByRequesterId", async () => {
        // Call function from repository
        const returnJoinRequests: JoinRequest[] = await datasourceJoinRequest.getJoinRequestByRequesterId(joinRequest.getRequester());
        
        expect(datasourceJoinRequest.getJoinRequestByRequesterId).toHaveBeenCalledTimes(1);
        expect(datasourceJoinRequest.getJoinRequestByRequesterId).toHaveBeenCalledWith(joinRequest.getRequester());
        expect(returnJoinRequests).toEqual([joinRequest, joinRequest]);
    });

    test("getJoinRequestByClassId", async () => {
        // Call function from repository
        const returnJoinRequests: JoinRequest[] = await datasourceJoinRequest.getJoinRequestByClassId(joinRequest.getClassId());
        
        expect(datasourceJoinRequest.getJoinRequestByClassId).toHaveBeenCalledTimes(1);
        expect(datasourceJoinRequest.getJoinRequestByClassId).toHaveBeenCalledWith(joinRequest.getClassId());
        expect(returnJoinRequests).toEqual([joinRequest, joinRequest]);
    });

    test("deleteJoinRequestById", async () => {
        // Call function from repository
        await datasourceJoinRequest.deleteJoinRequestById(joinRequest.getId()!);

        expect(datasourceJoinRequest.deleteJoinRequestById).toHaveBeenCalledTimes(1);
    });

});
