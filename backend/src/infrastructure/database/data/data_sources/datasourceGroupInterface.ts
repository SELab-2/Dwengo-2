import { DataSource } from "typeorm";
import { IGroupRepository } from "../../../../core/repositories/groupRepositoryInterface";

/**
 * Interface for the teacher data source.
 */
export abstract class IDatasourceGroup extends IGroupRepository{

    public constructor(
        protected datasource: DataSource
    ) {
        super();
    }

}