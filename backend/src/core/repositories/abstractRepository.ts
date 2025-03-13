import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { DatasourceFactoryTypeORM } from "../../infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM";

/**
 * Factory for creating datasources.
 */
export abstract class AbstractRepository {
    protected datasourceFactory: IDatasourceFactory = new DatasourceFactoryTypeORM();
}
