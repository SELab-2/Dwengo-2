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
            createTeacher: jest.fn((teacher: Teacher) => Promise.resolve(teacher))
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasource)
        };

        // Mock teacher
        teacher = new Teacher("email", "alice", "bob", "password");
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

});
