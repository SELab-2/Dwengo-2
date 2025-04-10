import { Teacher } from "../../../../src/core/entities/teacher";
import { IDatasourceFactory } from "../../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceTeacherTypeORM } from "../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTeacherTypeORM";

describe("TeacherRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let teacher: Teacher;

    let datasourceTeacher: DatasourceTeacherTypeORM;

    beforeEach(() => {
        datasourceMock = {
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceTeacher = {
            // datasource: jest.fn() as unknown as DataSource,
            createTeacher: jest.fn(() => Promise.resolve(teacher)),
            getTeacherById: jest.fn(() => Promise.resolve(teacher)),
            getTeacherByEmail: jest.fn(() => Promise.resolve(teacher)),
            getTeacherByFirstName: jest.fn(() => Promise.resolve(teacher)),
            getTeacherByLastName: jest.fn(() => Promise.resolve(teacher)),
            getAllTeachers: jest.fn(() => Promise.resolve([teacher, teacher])),
            updateTeacher: jest.fn(() => Promise.resolve(teacher)),
            deleteTeacherWithId: jest.fn(),
            deleteTeacherFromClass: jest.fn()
        } as any;

        // Mock teacher
        teacher = new Teacher("teacher@gmail.com", "alice", "bob", "password", "UGent", "1");
    });

    test("createTeacher", async () => {
        // Call function from repository
        const returnTeacher: Teacher = await datasourceTeacher.createTeacher(teacher);
        
        expect(datasourceTeacher.createTeacher).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.createTeacher).toHaveBeenCalledWith(teacher);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherById", async () => {
        // Call function from repository
        const returnTeacher: Teacher|null = await datasourceTeacher.getTeacherById(teacher.id!);

        expect(datasourceTeacher.getTeacherById).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.getTeacherById).toHaveBeenCalledWith(teacher.id!);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherByEmail", async () => {
        // Call function from repository
        const returnTeacher: Teacher|null = await datasourceTeacher.getTeacherByEmail(teacher.email);

        expect(datasourceTeacher.getTeacherByEmail).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.getTeacherByEmail).toHaveBeenCalledWith(teacher.email);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherByFirstName", async () => {
        // Call function from repository
        const returnTeacher: Teacher|null = await datasourceTeacher.getTeacherByFirstName(teacher.firstName);

        expect(datasourceTeacher.getTeacherByFirstName).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.getTeacherByFirstName).toHaveBeenCalledWith(teacher.firstName);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherByLastName", async () => {
        // Call function from repository
        const returnTeacher: Teacher|null = await datasourceTeacher.getTeacherByLastName(teacher.familyName);

        expect(datasourceTeacher.getTeacherByLastName).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.getTeacherByLastName).toHaveBeenCalledWith(teacher.familyName);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getAllTeachers", async () => {
        // Call function from repository
        const returnTeachers: Teacher[] = await datasourceTeacher.getAllTeachers();

        expect(datasourceTeacher.getAllTeachers).toHaveBeenCalledTimes(1);
        expect(returnTeachers).toEqual([teacher, teacher]);
    });

    test("updateTeacher", async () => {
        // Call function from repository
        const returnTeacher: Teacher = await datasourceTeacher.updateTeacher(teacher);

        expect(datasourceTeacher.updateTeacher).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.updateTeacher).toHaveBeenCalledWith(teacher);
        expect(returnTeacher).toEqual(teacher);
    });

    test("deleteTeacherWithId", async () => {
        // Call function from repository
        await datasourceTeacher.deleteTeacherWithId(teacher.id!);

        expect(datasourceTeacher.deleteTeacherWithId).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.deleteTeacherWithId).toHaveBeenCalledWith(teacher.id!);
    });

    test("deleteTeacherFromClass", async () => {
        // Call function from repository
        await datasourceTeacher.deleteTeacherFromClass(teacher.id!, "1");

        expect(datasourceTeacher.deleteTeacherFromClass).toHaveBeenCalledTimes(1);
        expect(datasourceTeacher.deleteTeacherFromClass).toHaveBeenCalledWith(teacher.id!, "1");
    });

});
