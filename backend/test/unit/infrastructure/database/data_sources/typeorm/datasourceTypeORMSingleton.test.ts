import { DataSource, Unique } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMSingleton } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMSingleton";

let connectionSettings: DatasourceTypeORMConnectionSettings;

jest.mock("typeorm", () => ({
    DataSource: jest.fn().mockImplementation(() => ({
        initialize: jest.fn().mockReturnValue(Promise.resolve(DataSource)),
    })),

    Entity: jest.fn(() => () => {}),
    Unique: jest.fn(() => () => {}),
    PrimaryGeneratedColumn: jest.fn(() => () => {}),
    PrimaryColumn: jest.fn(() => () => {}),
    Column: jest.fn(() => () => {}),
    OneToOne: jest.fn(() => () => {}),
    ManyToOne: jest.fn(() => () => {}),
    JoinColumn: jest.fn(() => () => {}),
    CreateDateColumn: jest.fn(() => () => {}),
}));

describe("DatasourceTypeORMSingleton", () => {

    beforeAll(() => {
        connectionSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432,
            "postgres",
            "postgres",
            "dwengo-database"
        );
    });

    test("getInstance", async () => {
        const datasource = await DatasourceTypeORMSingleton.getInstance(connectionSettings);

        expect(datasource).toBeDefined();
    });

});

// TODO: test that calling getInstance multiple times returns the same instance
