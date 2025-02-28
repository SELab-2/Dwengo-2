import { IDatasource } from "./datasourceInterface";

export interface IDatasourceFactory {
    
    createDatasource(): IDatasource;

}
