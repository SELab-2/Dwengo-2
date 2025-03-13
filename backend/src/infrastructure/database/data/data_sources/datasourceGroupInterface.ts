import { DataSource } from "typeorm";
import { Group } from "../../../../core/entities/group";

export abstract class IDatasourceGroup {
    public constructor(protected datasource: DataSource) {}

    public abstract create(entity: Group): Promise<Group>;

    public abstract getById(id: string): Promise<Group | null>;

    public abstract update(entity: Group): Promise<Group>;

    public abstract delete(id: string): Promise<void>;

    public abstract getByUserId(userId: string): Promise<Group[]>;

    public abstract getByAssignmentId(assignmentId: string): Promise<Group[]>;
}
