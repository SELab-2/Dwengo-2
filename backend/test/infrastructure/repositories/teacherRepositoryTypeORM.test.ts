import { Teacher } from "../../../src/core/entities/teacher";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { TeacherRepositoryTypeORM } from "../../../src/infrastructure/repositories/teacherRepositoryTypeORM";

describe("TeacherRepositoryTypeORM", () => {

    let datasourceFactoryMock: jest.Mocked<IDatasourceFactory>;
    let datasource: IDatasource;
    let teacherRepositoryTypeORM: TeacherRepositoryTypeORM;
    let teacher: Teacher;

    beforeEach(() => {
        datasource = {
            createTeacher: jest.fn((teacher: Teacher) => Promise.resolve(teacher)),
            getTeacherById: jest.fn((id: string) => Promise.resolve(teacher)),
            getTeacherByEmail: jest.fn((email: string) => Promise.resolve(teacher)),
            getTeacherByFirstName: jest.fn((first_name: string) => Promise.resolve(teacher)),
            getTeacherByLastName: jest.fn((last_name: string) => Promise.resolve(teacher)),
            getAllTeachers: jest.fn(() => Promise.resolve([teacher, teacher])),
            updateTeacher: jest.fn((updatedTeacher: Teacher) => Promise.resolve(updatedTeacher)),
            deleteTeacherWithId: jest.fn((id: string) => Promise.resolve()),

            // These do not matter for this test
            createClass: jest.fn(),
            getClassById: jest.fn(),
            getClassByName: jest.fn(),
            getAllClasses: jest.fn(),
            deleteClassById: jest.fn(),
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasource)
        };

        // Mock teacher
        teacher = new Teacher("email", "alice", "bob", "password", "id");
    });

    test("createTeacher", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        const returnTeacher: Teacher = await teacherRepositoryTypeORM.createTeacher(teacher);
        
        expect(datasource.createTeacher).toHaveBeenCalledTimes(1);
        expect(datasource.createTeacher).toHaveBeenCalledWith(teacher);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherById", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        const returnTeacher: Teacher|null = await teacherRepositoryTypeORM.getTeacherById(teacher.id!);

        expect(datasource.getTeacherById).toHaveBeenCalledTimes(1);
        expect(datasource.getTeacherById).toHaveBeenCalledWith(teacher.id!);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherByEmail", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        const returnTeacher: Teacher|null = await teacherRepositoryTypeORM.getTeacherByEmail(teacher.email);

        expect(datasource.getTeacherByEmail).toHaveBeenCalledTimes(1);
        expect(datasource.getTeacherByEmail).toHaveBeenCalledWith(teacher.email);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherByFirstName", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        const returnTeacher: Teacher|null = await teacherRepositoryTypeORM.getTeacherByFirstName(teacher.first_name);

        expect(datasource.getTeacherByFirstName).toHaveBeenCalledTimes(1);
        expect(datasource.getTeacherByFirstName).toHaveBeenCalledWith(teacher.first_name);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getTeacherByLastName", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        const returnTeacher: Teacher|null = await teacherRepositoryTypeORM.getTeacherByLastName(teacher.family_name);

        expect(datasource.getTeacherByLastName).toHaveBeenCalledTimes(1);
        expect(datasource.getTeacherByLastName).toHaveBeenCalledWith(teacher.family_name);
        expect(returnTeacher).toEqual(teacher);
    });

    test("getAllTeachers", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        const returnTeachers: Teacher[] = await teacherRepositoryTypeORM.getAllTeachers();

        expect(datasource.getAllTeachers).toHaveBeenCalledTimes(1);
        expect(returnTeachers).toEqual([teacher, teacher]);
    });

    test("updateTeacher", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        const returnTeacher: Teacher = await teacherRepositoryTypeORM.updateTeacher(teacher);

        expect(datasource.updateTeacher).toHaveBeenCalledTimes(1);
        expect(datasource.updateTeacher).toHaveBeenCalledWith(teacher);
        expect(returnTeacher).toEqual(teacher);
    });

    test("deleteTeacherWithId", async () => {
        // Make repository
        teacherRepositoryTypeORM = new TeacherRepositoryTypeORM(datasourceFactoryMock);

        expect(datasourceFactoryMock.createDatasource).toHaveBeenCalledTimes(1);

        // Call function from repository
        await teacherRepositoryTypeORM.deleteTeacherWithId(teacher.id!);

        expect(datasource.deleteTeacherWithId).toHaveBeenCalledTimes(1);
        expect(datasource.deleteTeacherWithId).toHaveBeenCalledWith(teacher.id!);
    });

});
