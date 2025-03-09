import { Group } from "../../../../../core/entities/group";
import { IGroupRepository } from "../../../../../core/repositories/groupRepositoryInterface";
import { DataSource } from "typeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";


export class DatasourceGroupTypeORM extends IGroupRepository {

    
    public constructor(
        protected datasource: DataSource
    ) {
        super();
    }


    public create(group: Group): Promise<Group> {
        throw new Error("Method not implemented.");
    }
    public async getById(id: string): Promise<Group|null> {
        throw new Error("Method not implemented.")
    }
    public getAll(): Promise<Group[]> {
        throw new Error("Method not implemented.");
    }
    public update(group: Group): Promise<Group> {
        throw new Error("Method not implemented.");
    }
    public delete(group: Group): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public deleteWithId(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // Maps the typeORM result to an entity.
    // This is here and not in groupTypeORM itself because the group entity needs data from multiple tables.
    private toEntity(groupModel: GroupTypeORM, students: StudentTypeORM[]): Group{
        throw new Error("Method not implemented.");
        return new Group([], groupModel.class.toClassEntity(), //TODO
        )
    }

}
