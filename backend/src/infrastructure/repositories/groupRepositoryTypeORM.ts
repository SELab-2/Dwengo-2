import { EntityNotFoundError } from "../../config/error";
import { Group } from "../../core/entities/group";
import { IGroupRepository } from "../../core/repositories/groupRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceGroup } from "../database/data/data_sources/datasourceGroupInterface";

export class GroupRepositoryTypeORM extends IGroupRepository {
    private datasource: IDatasource;
    private datasourceGroup: Promise<IDatasourceGroup>
    
    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceGroup = this.datasource.getDatasourceGroup();
    }

    public async create(group: Group): Promise<Group> {
        return await (await this.datasourceGroup).create(group);
    }

    async getById(id: string): Promise<Group> {
        const group: Group|null = await (await this.datasourceGroup).getById(id);

        if(group) {
            return group;
        } else {
            throw new EntityNotFoundError(`Group with id: ${id} not found`);
        }
    }

    public async update(group: Group): Promise<Group> {
        return await (await this.datasourceGroup).update(group);
    }

    public async delete(groupId: string): Promise<void> {
        return await (await this.datasourceGroup).delete(groupId);
    }

    public async getByUserId(userId: string): Promise<Group[]> {
        // TODO: i assume that i get a student id
        return await (await this.datasourceGroup).getByUserId(userId);
    }

    public async getByAssignmentId(assignmentId: string): Promise<Group[]> {
        return await (await this.datasourceGroup).getByAssignmentId(assignmentId);
    }

}
