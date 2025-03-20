import { EntityNotFoundError } from "../../config/error";
import { Assignment } from "../../core/entities/assignment";
import { IAssignmentRepository } from "../../core/repositories/assignmentRepositoryInterface";
import { DatasourceAssignmentTypeORM } from "../database/data/data_sources/typeorm/datasourceAssignmentTypeORM";

export class AssignmentRepositoryTypeORM extends IAssignmentRepository {
    private datasourceAssignment: DatasourceAssignmentTypeORM

    public constructor() {
        super();
        this.datasourceAssignment = new DatasourceAssignmentTypeORM;
    }

    public async createAssignment(assignment: Assignment, classId: string): Promise<Assignment> {
        return await this.datasourceAssignment.createAssignment(assignment, classId);
    }

    public async getAssignmentById(id: string): Promise<Assignment> {
        const assignment: Assignment | null = await this.datasourceAssignment.getAssignmentById(id);

        if (assignment) {
            return assignment;
        } else {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }
    }

    public async getAssignmentsByClassId(classId: string): Promise<Assignment[]> {
        return await this.datasourceAssignment.getAssignmentsByClassId(classId);
    }

    public async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
        return await this.datasourceAssignment.getAssignmentsByUserId(userId);
    }

    public async getAssignmentsByLearningPathId(learningPathId: string): Promise<Assignment[]> {
        return await this.datasourceAssignment.getAssignmentsByLearningPathId(learningPathId);
    }

    public async deleteAssignmentById(id: string): Promise<void> {
        return await this.datasourceAssignment.deleteAssignmentById(id);
    }

    public async updateAssignmentById(id: string, updatedFields: Partial<Assignment>): Promise<Assignment> {
        const updatedAssignment: Assignment | null = await 
            this.datasourceAssignment
        .updateAssignmentById(id, updatedFields);

        if (updatedAssignment) {
            return updatedAssignment;
        } else {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }
    }
}
