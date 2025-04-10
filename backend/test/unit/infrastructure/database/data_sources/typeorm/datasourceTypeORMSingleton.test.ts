import { DataSource, Unique } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMSingleton } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMSingleton";

let connectionSettings: DatasourceTypeORMConnectionSettings;

jest.mock("typeorm", () => {
    const actualTypeORM = jest.requireActual("typeorm");
    const mockInitialize = jest.fn();

    const mockDataSourceInstance = {
        initialize: mockInitialize,
        getRepository: jest.fn(),
        destroy: jest.fn().mockResolvedValue(true),
        isInitialized: true,
    };

    mockInitialize.mockResolvedValue(mockDataSourceInstance);

    return {
        ...actualTypeORM,
        DataSource: jest.fn(() => mockDataSourceInstance),
    };
});


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
    afterAll(async () => {
        await DatasourceTypeORMSingleton.shutdownDatabase();
    });
});

// TODO: test that calling getInstance multiple times returns the same instance
