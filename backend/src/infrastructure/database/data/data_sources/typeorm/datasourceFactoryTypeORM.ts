import { IDatasourceFactory } from "../datasourceFactoryInterface";
import { DatasourceTypeORM } from "./datasourceTypeORM";

/**
 * Factory class for creating DatasourceTypeORM instances.
 */
export class DatasourceFactoryTypeORM implements IDatasourceFactory {
    /**
     * Creates a new DatasourceTypeORM instance.
     * @returns a new DatasourceTypeORM instance.
     */
    public createDatasource(): DatasourceTypeORM {
        return new DatasourceTypeORM();
    }
}
