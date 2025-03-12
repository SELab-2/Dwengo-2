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


    public async createAssignment(assignment: Assignment, teacherId: string): Promise<Assignment> {
        return await (await this.datasourceAssignment).createAssignment(assignment, teacherId);
    }

    public async getAssignmentById(id: string): Promise<Assignment> {
        const assignment: Assignment|null = await (await this.datasourceAssignment).getAssignmentById(id);

        if(assignment) {
            return assignment
        } else {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }
    }

    public async getAssignmentsByClassId(classId: string): Promise<Assignment[]> {
        return await (await this.datasourceAssignment).getAssignmentsByClassId(classId);
    }

    public async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
        return await (await this.datasourceAssignment).getAssignmentsByUserId(userId);
    }

    public async getAssignmentsByLearningPathId(learningPathId: string): Promise<Assignment[]> {
        return await (await this.datasourceAssignment).getAssignmentsByLearningPathId(learningPathId);
    }

    public async deleteAssignmentById(id: string): Promise<void> {
        return await (await this.datasourceAssignment).deleteAssignmentById(id);
    }

    public async updateAssignmentById(id: string, updatedFields: Partial<Assignment>): Promise<Assignment> {
        const updatedAssignment: Assignment|null = await (await this.datasourceAssignment).updateAssignmentById(id, updatedFields);

        if(updatedAssignment) {
            return updatedAssignment;
        } else {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }
    }

}
