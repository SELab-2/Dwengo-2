import { EntityNotFoundError } from "../../config/error";
import { Assignment } from "../../core/entities/assignment";
import { IAssignmentRepository } from "../../core/repositories/assignmentRepositoryInterface";
import { DatasourceAssignmentTypeORM } from "../database/data/data_sources/typeorm/datasourceAssignmentTypeORM";

export class AssignmentRepositoryTypeORM extends IAssignmentRepository {
    private datasourceAssignment: DatasourceAssignmentTypeORM;

    public constructor() {
        super();
        this.datasourceAssignment = new DatasourceAssignmentTypeORM();
    }

    public async create(assignment: Assignment): Promise<Assignment> {
        return await this.datasourceAssignment.createAssignment(assignment, assignment.classId);
    }

    public async getById(id: string): Promise<Assignment> {
        return await this.datasourceAssignment.getAssignmentById(id);
    }

    public async getByClassId(classId: string): Promise<Assignment[]> {
        return await this.datasourceAssignment.getAssignmentsByClassId(classId);
    }

    public async getByUserId(userId: string): Promise<Assignment[]> {
        return await this.datasourceAssignment.getAssignmentsByUserId(userId);
    }

    public async getByLearningPathId(learningPathId: string): Promise<Assignment[]> {
        return await this.datasourceAssignment.getAssignmentsByLearningPathId(learningPathId);
    }

    public async delete(id: string): Promise<void> {
        return await this.datasourceAssignment.deleteAssignmentById(id);
    }

    public async update(updatedFields: Assignment): Promise<Assignment> {
        const updatedAssignment: Assignment = await this.datasourceAssignment.updateAssignmentById(updatedFields);

        return updatedAssignment;
    }
}
