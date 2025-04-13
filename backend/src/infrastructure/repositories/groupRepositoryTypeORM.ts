import { EntityNotFoundError } from "../../config/error";
import { Group } from "../../core/entities/group";
import { IGroupRepository } from "../../core/repositories/groupRepositoryInterface";
import { DatasourceGroupTypeORM } from "../database/data/data_sources/typeorm/datasourceGroupTypeORM";

export class GroupRepositoryTypeORM extends IGroupRepository {
    private datasourceGroup: DatasourceGroupTypeORM;

    public constructor() {
        super();
        this.datasourceGroup = new DatasourceGroupTypeORM();
    }

    public async create(group: Group): Promise<Group> {
        return await this.datasourceGroup.create(group);
    }

    async getById(id: string): Promise<Group> {
        const group: Group | null = await this.datasourceGroup.getById(id);

        if (group) {
            return group;
        } else {
            throw new EntityNotFoundError(`Group with id: ${id} not found`);
        }
    }

    public async update(group: Group): Promise<Group> {
        return await this.datasourceGroup.update(group);
    }

    public async delete(groupId: string): Promise<void> {
        return await this.datasourceGroup.delete(groupId);
    }

    public async getByUserId(userId: string): Promise<Group[]> {
        // TODO: i assume that i get a student id
        return await this.datasourceGroup.getByUserId(userId);
    }

    public async getByAssignmentId(assignmentId: string): Promise<Group[]> {
        return await this.datasourceGroup.getByAssignmentId(assignmentId);
    }
}
