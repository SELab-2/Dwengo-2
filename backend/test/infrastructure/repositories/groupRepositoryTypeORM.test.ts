import { Group } from "../../../src/core/entities/group";
import { IDatasourceGroup } from "../../../src/infrastructure/database/data/data_sources/datasourceGroupInterface";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";

describe("GroupRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let newGroup: Group;
    let idGroup: Group;
    let memberIds: string[];

    let datasourceGroup: IDatasourceGroup;

    let returnGroup: Group|null;

    beforeEach(() => {
        datasourceMock = {
            getDatasourceAssignment: jest.fn(),
            getDatasourceMessage: jest.fn(),
            getDatasourceThread: jest.fn(),
            getDatasourceSubmission: jest.fn()
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceGroup = {
            create: jest.fn(() => Promise.resolve(newGroup)),
            getById: jest.fn(() => Promise.resolve(newGroup)),
            update: jest.fn(() => Promise.resolve(newGroup)),
            delete: jest.fn()
        } as any;

        // Mock students
        memberIds = [
            "id_1",
            "id_2"
        ]

        // Mock class
        const class_id = "id_1"

        // Mock Group
        newGroup = new Group(memberIds, class_id);

        // Mock Group with Id
        idGroup = new Group(memberIds, class_id, "id_g");

    });

    test("create", async () => {
        // Call function from repository
        returnGroup = await datasourceGroup.create(newGroup);
        
        expect(datasourceGroup.create).toHaveBeenCalledTimes(1);
        expect(datasourceGroup.create).toHaveBeenCalledWith(newGroup);
        expect(returnGroup).toEqual(newGroup);
    });

    test("getById", async () => {
        const createdGroup = await datasourceGroup.create(newGroup);

        // Call function from repository
        returnGroup = await datasourceGroup.getById(createdGroup.id!);

        expect(datasourceGroup.getById).toHaveBeenCalledTimes(1);
        expect(datasourceGroup.getById).toHaveBeenCalledWith(createdGroup.id!);
        expect(returnGroup).toEqual(createdGroup);
    });

    test("update", async () => {
        const createdGroup = await datasourceGroup.create(newGroup);

        // We remove a a student from the group.
        createdGroup.memberIds.pop()

        returnGroup = await datasourceGroup.update(createdGroup);
        expect(datasourceGroup.update).toHaveBeenCalledTimes(1);
        expect(datasourceGroup.update).toHaveBeenCalledWith(createdGroup);
        expect(returnGroup).toEqual(createdGroup)
    });

    test("delete", async () => {
        // Call function from repository
        await datasourceGroup.delete(idGroup.id!);

        expect(datasourceGroup.delete).toHaveBeenCalledTimes(1);
        expect(datasourceGroup.delete).toHaveBeenCalledWith(idGroup.id!);
    });

});
