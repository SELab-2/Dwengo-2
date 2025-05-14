import { JoinCode } from "../../../../src/core/entities/joinCode";
import { IDatasourceFactory } from "../../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceJoinCodeTypeORM } from "../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceJoinCodeTypeORM";
import { JoinCodeRepositoryTypeORM } from "../../../../src/infrastructure/repositories/joinCodeRepositoryTypeORM";

describe("JoinCodeRepositoryTypeORM", () => {
    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let datasourceJoinCode: DatasourceJoinCodeTypeORM;
    let joinCode: JoinCode;

    beforeEach(() => {
        datasourceMock = {};
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        // Mock datasourceJoinCode
        datasourceJoinCode = {
            create: jest.fn(() => Promise.resolve(joinCode)),
            getById: jest.fn(() => Promise.resolve(joinCode)),
            getByClassId: jest.fn(() => Promise.resolve([joinCode])),
            update: jest.fn(() => Promise.resolve(joinCode)),
            delete: jest.fn(() => Promise.resolve()),
        } as any;

        joinCode = new JoinCode("class-456", new Date("2025-03-11T12:00:00Z"), "joincode-123", false);

        joinCodeRepository = new JoinCodeRepositoryTypeORM();
        (joinCodeRepository as any).datasourceJoinCode = datasourceJoinCode;
    });

    let joinCodeRepository: JoinCodeRepositoryTypeORM;

    test("create", async () => {
        await joinCodeRepository.create(joinCode);

        expect(datasourceJoinCode.create).toHaveBeenCalledTimes(1);
        expect(datasourceJoinCode.create).toHaveBeenCalledWith(joinCode);
    });

    test("getById", async () => {
        await joinCodeRepository.getById("joincode-123");

        expect(datasourceJoinCode.getById).toHaveBeenCalledTimes(1);
        expect(datasourceJoinCode.getById).toHaveBeenCalledWith("joincode-123");
    });

    test("getByClassId", async () => {
        const result = await joinCodeRepository.getByClassId("class-456");

        expect(datasourceJoinCode.getByClassId).toHaveBeenCalledTimes(1);
        expect(datasourceJoinCode.getByClassId).toHaveBeenCalledWith("class-456");
        expect(result).toEqual([joinCode]);
    });

    test("update", async () => {
        joinCode.isExpired = true;
        const updatedJoinCode = await joinCodeRepository.update(joinCode);

        expect(datasourceJoinCode.update).toHaveBeenCalledTimes(1);
        expect(datasourceJoinCode.update).toHaveBeenCalledWith(joinCode);
        expect(updatedJoinCode.isExpired).toEqual(true);
    });

    test("delete", async () => {
        await joinCodeRepository.delete("joincode-123");

        expect(datasourceJoinCode.delete).toHaveBeenCalledTimes(1);
        expect(datasourceJoinCode.delete).toHaveBeenCalledWith("joincode-123");
    });
});
