import { EntityNotFoundError } from "../../../../../config/error";
import { Assignment } from "../../../../../core/entities/assignment";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { IDatasourceAssignment } from "../datasourceAssignmentInterface";

export class DatasourceAssignmentTypeORM extends IDatasourceAssignment {

    public async createAssignment(newAssignment: Assignment, teacherId: string): Promise<Assignment> {
        // Check if the class exists
        const classModel: ClassTypeORM | null = await this.datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: newAssignment.classId } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${newAssignment.classId} not found`);
        }

        // Class exists, check if teacher exists
        const teacherModel: TeacherTypeORM | null = await this.datasource
            .getRepository(TeacherTypeORM)
            .findOne({ where: { id: teacherId } });

        if(!teacherModel) {
            throw new EntityNotFoundError(`Teacher with id ${teacherId} not found`);
        }

        // Class exists and teacher exist: insert assignment into the database
        const assignmentModel: AssignmentTypeORM = this.datasource
            .getRepository(AssignmentTypeORM)
            .create({
                class: { id: newAssignment.classId },
                learning_path_id: newAssignment.learningPathId,
                start: newAssignment.startDate,
                deadline: newAssignment.deadline,
                extra_instructions: newAssignment.extraInstructions
            });

        await this.datasource.getRepository(AssignmentTypeORM).save(assignmentModel);

        return assignmentModel.toAssignmentEntity();
    }

    public async getAssignmentById(id: string): Promise<Assignment|null> {
        const assignmentModel: AssignmentTypeORM | null = await this.datasource
            .getRepository(AssignmentTypeORM)
            .findOne({ 
                where: { id: id },
                relations: ["class"]
            });

        if (assignmentModel !== null) {
            return assignmentModel.toAssignmentEntity();
        }
        return null;
    }

    public async getAssignmentsByClassId(classId: string): Promise<Assignment[]> {
        const assignmentModels: AssignmentTypeORM[] = await this.datasource
            .getRepository(AssignmentTypeORM)
            .find({ 
                where: { class: { id: classId } },
                relations: ["class"]
            });

        return assignmentModels.map((assignmentModel: AssignmentTypeORM) => assignmentModel.toAssignmentEntity());
    }

    public async getAssignmentsByLearningPathId(learningPathId: string): Promise<Assignment[]> {
        const assignmentModels: AssignmentTypeORM[] = await this.datasource
            .getRepository(AssignmentTypeORM)
            .find({ 
                where: { learning_path_id: learningPathId },
                relations: ["class"]
            });

        return assignmentModels.map((assignmentModel: AssignmentTypeORM) => assignmentModel.toAssignmentEntity());
    }

    public async deleteAssignmentById(id: string): Promise<void> {
        await this.datasource.getRepository(AssignmentTypeORM).delete(id);
    }

}
