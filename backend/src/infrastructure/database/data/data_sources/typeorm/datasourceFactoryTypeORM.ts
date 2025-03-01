import { IDatasourceFactory } from "../datasourceFactoryInterface";
import { DatasourceTypeORM } from "./datasourceTypeORM";

export class DatasourceFactoryTypeORM implements IDatasourceFactory {
    
    public createDatasource(): DatasourceTypeORM {
        return new DatasourceTypeORM();
    };

}
