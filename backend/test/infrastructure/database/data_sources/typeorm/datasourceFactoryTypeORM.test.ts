import { DatasourceFactoryTypeORM } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM";
import { DatasourceTypeORM } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM";

jest.mock("../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM", () => {
    return {
        DatasourceTypeORM: jest.fn().mockImplementation(() => {
            return {
                createTeacher: jest.fn()
            };
        })
    };
});

describe("DatasourceFactoryTypeORM", () => {
    test("createDatasource", () => {
        let datasourceFactoryTypeORM = new DatasourceFactoryTypeORM();
        let datasourceTypeORM: DatasourceTypeORM = datasourceFactoryTypeORM.createDatasource();

        expect(datasourceTypeORM.createTeacher).toHaveBeenCalledTimes(0);
    });
});
