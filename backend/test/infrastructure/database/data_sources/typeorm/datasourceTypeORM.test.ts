import { DataSource, FindOneOptions, } from "typeorm";
import { UserTypeORM } from "../../../../../src/infrastructure/database/data/data_models/userTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { TeacherTypeORM } from "../../../../../src/infrastructure/database/data/data_models/teacherTypeorm";

// Variables
let datasourceSettings: DatasourceTypeORMConnectionSettings;

// Mock TypeORM
jest.mock("typeorm", () => ({
    DataSource: jest.fn().mockImplementation(() => ({
        getRepository: jest.fn().mockReturnValue({
            save: jest.fn(),
            findOne: jest.fn((options: FindOneOptions) => Promise.resolve({} as TeacherTypeORM)),
        } as any)
    })),
    DataSourceOptions: jest.fn(),
    FindOneOptions: jest.fn(),

    // Mock the decorators in the data models
    Entity: jest.fn(() => () => {}),
    PrimaryGeneratedColumn: jest.fn(() => () => {}),
    PrimaryColumn: jest.fn(() => () => {}),
    Column: jest.fn(() => () => {}),
    OneToOne: jest.fn(() => () => {}),
    JoinColumn: jest.fn(() => () => {}),
    CreateDateColumn: jest.fn(() => () => {}),

    // Querying
    Repository: jest.fn().mockImplementation(() => ({
        findOne: jest.fn((options: FindOneOptions) => Promise.resolve({} as TeacherTypeORM)),
    }))
}));

// Mock datamodel
jest.mock("../../../../../src/infrastructure/database/data/data_models/teacherTypeorm", () => ({
    TeacherTypeORM: jest.fn().mockImplementation(() => ({
        toTeacherEntity: jest.fn((user: UserTypeORM) => ({} as any))
    }))
}));

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
    test("createTeacher", () => {
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

    test("getTeacherById", async () => {
        const dataSource = new DataSource(datasourceSettings.toObject()); // TypeORM

        // Find teacher
        const teacherRepository = dataSource.getRepository(TeacherTypeORM);
        const teacherModel = await teacherRepository.findOne({ where: { id: "id" }, relations: ["teacher"] });

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.findOne).toHaveBeenCalled();

        // Teacher found? Then map to teacher entity
        if (teacherModel !== null) {
            const teacher = teacherModel.toTeacherEntity(teacherModel.teacher);
            // expect(teacher).toBeDefined();
        }
    });

});
