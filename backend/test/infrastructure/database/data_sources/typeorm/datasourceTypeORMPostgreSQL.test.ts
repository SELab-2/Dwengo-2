import { DataSource } from "typeorm";
import { UserTypeORM } from "../../../../../src/infrastructure/database/data/data_models/userTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { TeacherTypeORM } from "../../../../../src/infrastructure/database/data/data_models/teacherTypeorm";

// Mock TypeORM
jest.mock("typeorm", () => ({
    DataSource: jest.fn().mockImplementation(() => ({
        getRepository: jest.fn().mockReturnValue({
            save: jest.fn(),
        } as any)
    })),
    DataSourceOptions: jest.fn(),

    // TODO: should instead mock the data models?
    // Mock the decorators in the data models
    Entity: jest.fn(() => () => {}),
    PrimaryGeneratedColumn: jest.fn(() => () => {}),
    PrimaryColumn: jest.fn(() => () => {}),
    Column: jest.fn(() => () => {}),
    OneToOne: jest.fn(() => () => {}),
    JoinColumn: jest.fn(() => () => {}),
    CreateDateColumn: jest.fn(() => () => {}),
}));

// Variables
let datasourceSettings: DatasourceTypeORMConnectionSettings;

beforeAll(() => {
    datasourceSettings = DatasourceTypeORMConnectionSettingsFactory
    .createDatasourceTypeORMConnectionSettings(
        "postgres",
        5432,
        "postgres",
        "postgres",
        "dwengo-database"
    );
});

describe("DatasourceTypeORM", () => {  
    it("createTeacher", () => {
        const dataSource = new DataSource(datasourceSettings.toObject()); // TypeORM

        // Save user
        const userRepository = dataSource.getRepository(UserTypeORM);
        userRepository.save(UserTypeORM.createUserTypeORM({} as any));

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.save).toHaveBeenCalled();
        
        // Save teacher
        const teacherRepository = dataSource.getRepository(TeacherTypeORM);
        teacherRepository.save(TeacherTypeORM.createTeacherTypeORM({} as any, {} as any));

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.save).toHaveBeenCalled();
    });
});
