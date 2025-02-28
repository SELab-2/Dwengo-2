import { DataSource } from "typeorm";
import { UserTypeORM } from "../../../../../src/infrastructure/database/data/data_models/userTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";

let datasourceSettings: DatasourceTypeORMConnectionSettings;

jest.mock("typeorm", () => ({
    DataSource: jest.fn().mockImplementation(() => ({
        getRepository: jest.fn().mockReturnValue({
            save: jest.fn(),
        } as any)
    })),
    DataSourceOptions: jest.fn(),

    // TODO: should instead mock the data models?
    Entity: jest.fn(() => () => {}),
    PrimaryGeneratedColumn: jest.fn(() => () => {}),
    PrimaryColumn: jest.fn(() => () => {}),
    Column: jest.fn(() => () => {}),
    OneToOne: jest.fn(() => () => {}),
    JoinColumn: jest.fn(() => () => {}),
    CreateDateColumn: jest.fn(() => () => {}),
}));

describe("Mock example", () => {

    datasourceSettings = DatasourceTypeORMConnectionSettingsFactory
    .createDatasourceTypeORMConnectionSettings(
        "postgres",
        5432,
        "postgres",
        "postgres",
        "dwengo-database"
    );

    it("should be mocked", () => {
        const dataSource = new DataSource(datasourceSettings.toObject());
        const userRepository = dataSource.getRepository(UserTypeORM);
        userRepository.save(UserTypeORM.createUserTypeORM({} as any)); // TODO: ?

        expect(userRepository.save).toHaveBeenCalled();
        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
    });
});
