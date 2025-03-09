import { Group } from "../../../src/core/entities/group";
import { IDatasourceGroup } from "../../../src/infrastructure/database/data/data_sources/datasourceGroupInterface";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { Student } from "../../../src/core/entities/student";
import { Class } from "../../../src/core/entities/class";

describe("GroupRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let newGroup: Group;
    let students: Student[];

    let datasourceGroup: IDatasourceGroup;

    let returnGroup: Group|null;

    beforeEach(() => {
        datasourceMock = {
            getDatasourceTeacher: jest.fn(),
            getDatasourceClass: jest.fn(),
            getDatasourceGroup: jest.fn(),
            getDatasourceJoinRequest: jest.fn(),
            getDatasourceAssignment: jest.fn(),
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
        students = [
            new Student("email_1", "firstname", "lastname", "aaa", "school", "id_1"),
            new Student("email_2", "firstname", "lastname", "aaa", "school", "id_2")
        ]

        // Mock class
        const newClass = new Class("Programmeren", "Voor mensen die niet kunnen programmeren", "Beginners");

        // Mock Group
        newGroup = new Group(students, newClass);


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
        createdGroup.students.pop()

        returnGroup = await datasourceGroup.update(createdGroup);
        expect(datasourceGroup.update).toHaveBeenCalledTimes(1);
        expect(datasourceGroup.update).toHaveBeenCalledWith(createdGroup);
        expect(returnGroup).toEqual(createdGroup)
    });

    test("delete", async () => {
        // Call function from repository
        await datasourceGroup.delete(newGroup);

        expect(datasourceGroup.delete).toHaveBeenCalledTimes(1);
        expect(datasourceGroup.delete).toHaveBeenCalledWith(newGroup);
    });

});
