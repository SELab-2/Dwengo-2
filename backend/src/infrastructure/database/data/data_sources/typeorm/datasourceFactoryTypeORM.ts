import { IDatasourceFactory } from "../datasourceFactoryInterface";
import { DatasourceTypeORMPostgreSQL } from "./datasourceTypeORMPostgreSQL";

export class DatasourceFactoryTypeORM implements IDatasourceFactory {
    
    public createDatasource(): DatasourceTypeORMPostgreSQL {
        return new DatasourceTypeORMPostgreSQL();
    };

}
