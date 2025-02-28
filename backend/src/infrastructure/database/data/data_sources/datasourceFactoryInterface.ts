import { DatasourceTypeORMPostgreSQL } from "./datasourceTypeORMPostgreSQL";

export interface IDatasourceFactory {
    
    createDatasource(): DatasourceTypeORMPostgreSQL;

}
