import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { DatasourceFactoryTypeORM } from "../../infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM";

export abstract class AbstractRepository {

    // Factory for creating datasources.
    protected datasourceFactory: IDatasourceFactory = new DatasourceFactoryTypeORM();

}