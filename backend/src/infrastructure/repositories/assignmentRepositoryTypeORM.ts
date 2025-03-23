import { EntityNotFoundError } from "../../config/error";
import { Assignment } from "../../core/entities/assignment";
import { IAssignmentRepository } from "../../core/repositories/assignmentRepositoryInterface";
import { IDatasourceAssignment } from "../database/data/data_sources/datasourceAssignmentInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";

export class AssignmentRepositoryTypeORM extends IAssignmentRepository {
    private datasource: IDatasource;
    private datasourceAssignment: Promise<IDatasourceAssignment>;

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceAssignment = this.datasource.getDatasourceAssignment();
    }

    public async create(assignment: Assignment): Promise<Assignment> {
        return await (await this.datasourceAssignment).createAssignment(assignment, assignment.classId);
    }

    public async getById(id: string): Promise<Assignment> {
        const assignment: Assignment | null = await (await this.datasourceAssignment).getAssignmentById(id);

        if (assignment) {
            return assignment;
        } else {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }
    }

    public async getByClassId(classId: string): Promise<Assignment[]> {
        return await (await this.datasourceAssignment).getAssignmentsByClassId(classId);
    }

    public async getByUserId(userId: string): Promise<Assignment[]> {
        return await (await this.datasourceAssignment).getAssignmentsByUserId(userId);
    }

    public async getByLearningPathId(learningPathId: string): Promise<Assignment[]> {
        return await (await this.datasourceAssignment).getAssignmentsByLearningPathId(learningPathId);
    }

    public async delete(id: string): Promise<void> {
        return await (await this.datasourceAssignment).deleteAssignmentById(id);
    }

    public async update(id: string, updatedFields: Partial<Assignment>): Promise<Assignment> {
        const updatedAssignment: Assignment | null = await (
            await this.datasourceAssignment
        ).updateAssignmentById(id, updatedFields);

        if (updatedAssignment) {
            return updatedAssignment;
        } else {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }
    }
}
