import { EntityNotFoundError } from "../../../../../config/error";
import { Assignment } from "../../../../../core/entities/assignment";
import { AssignmentGroupTypeORM } from "../../data_models/assignmentForGroupTypeorm";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
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

    public async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
        const assignmentsJoinResult = await this.datasource
            .getRepository(StudentOfGroupTypeORM)
            .createQueryBuilder()
            .where("StudentOfGroupTypeORM.student = :id", { id: userId })
            // Join StudentOfGroup
            .leftJoinAndSelect("StudentOfGroupTypeORM.group", "group") // Last one is alias
            // Join Group to AssignmentGroup
            .leftJoinAndSelect("group.assignmentGroup", "assignmentGroup")        
            // Join AssignmentForGroup to Assignment
            .leftJoinAndSelect("assignmentGroup.assignment", "assignment")
            // Join Assignment to Class
            .leftJoinAndSelect("assignment.class", "class")
            .getMany();

        return assignmentsJoinResult.map((assignmentJoinResult) => {
            return assignmentJoinResult.group.assignmentGroup.assignment.toAssignmentEntity();
        });
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

    public async updateAssignmentById(id: string, updatedFields: Partial<Assignment>): Promise<Assignment | null> {
        const updateResult = await this.datasource
            .getRepository(AssignmentTypeORM)
            .update(id, updatedFields);
        
        /* Some notes: I did not found any documentation on the return value of update.
         * So i asked ChatGPT: https://chatgpt.com/share/67d1c206-18f4-8004-a760-b40d3d2ef2d0
         * Postgresql has affected >= 1 even if it finds an entry that doesn't need to be updated.
         * So it only has affected == 0 if it doesn't find any entry to update.
         */
        if (updateResult.affected || 0 > 0) { 
            return await this.getAssignmentById(id);
        } 
        return null;
    }

}
