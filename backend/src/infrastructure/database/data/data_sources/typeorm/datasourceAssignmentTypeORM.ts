import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Assignment } from "../../../../../core/entities/assignment";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";

export class DatasourceAssignmentTypeORM extends DatasourceTypeORM {
    //TODO: classId can be removed
    public async createAssignment(newAssignment: Assignment, classId: string): Promise<Assignment> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // Check if the class exists
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: newAssignment.classId } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        // Class exists and teacher exist: insert assignment into the database
        let assignmentModel = AssignmentTypeORM.createTypeORM(newAssignment, classModel);
        assignmentModel = datasource.getRepository(AssignmentTypeORM).create(assignmentModel);

        await datasource.getRepository(AssignmentTypeORM).save(assignmentModel);

        return assignmentModel.toAssignmentEntity();
    }

    public async getAssignmentById(id: string): Promise<Assignment> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModel: AssignmentTypeORM | null = await datasource.getRepository(AssignmentTypeORM).findOne({
            where: { id: id },
            relations: ["class"],
        });
        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }

        return assignmentModel.toAssignmentEntity();
    }

    public async getAssignmentsByClassId(classId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModels: AssignmentTypeORM[] = await datasource.getRepository(AssignmentTypeORM).find({
            where: { class: { id: classId } },
            relations: ["class"],
        });

        return assignmentModels.map((assignmentModel: AssignmentTypeORM) => assignmentModel.toAssignmentEntity());
    }


    public async getAssignmentsByUserId(studentOrTeacherId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
            where: { id: studentOrTeacherId }
        })

        if (teacherModel) { // The user is a teacher
            const assignmentsJoinResult = await datasource
                .getRepository(AssignmentTypeORM)
                .createQueryBuilder("assignment")
                .innerJoinAndSelect("assignment.class", "class")
                .innerJoin(
                TeacherOfClassTypeORM,
                "teacherOfClass",
                "teacherOfClass.class_id = class.id"
                )
                .where("teacherOfClass.teacher_id = :teacherId", { studentOrTeacherId })
                .getMany();
            return assignmentsJoinResult.map(assigmentJoinResult => assigmentJoinResult.toAssignmentEntity());
            
        } else { // The user is a student
            const assignmentsJoinResult = await datasource
                .getRepository(StudentOfGroupTypeORM)
                .createQueryBuilder()
                .where("StudentOfGroupTypeORM.student = :id", { id: studentOrTeacherId })
                // Join StudentOfGroup
                .leftJoinAndSelect("StudentOfGroupTypeORM.group", "group") // Last one is alias
                // Join Group to AssignmentGroup
                .leftJoinAndSelect("group.assignment", "assignment")
                // Join Assignment to Class
                .leftJoinAndSelect("assignment.class", "class")
                .getMany();
            return assignmentsJoinResult.map(assignmentJoinResult => {
                return assignmentJoinResult.group.assignment.toAssignmentEntity();
            });

        }
        

        
    }

    public async getAssignmentsByLearningPathId(learningPathId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModels: AssignmentTypeORM[] = await datasource.getRepository(AssignmentTypeORM).find({
            where: { learning_path_id: learningPathId },
            relations: ["class"],
        });

        return assignmentModels.map((assignmentModel: AssignmentTypeORM) => assignmentModel.toAssignmentEntity());
    }

    public async deleteAssignmentById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        await datasource.getRepository(AssignmentTypeORM).delete(id);
    }

    public async updateAssignmentById(updatedFields: Assignment): Promise<Assignment> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: ClassTypeORM | null = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: updatedFields.classId },
        });

        if (!classModel) {
            throw new EntityNotFoundError("Class not found");
        }

        await datasource
            .getRepository(AssignmentTypeORM)
            .save(AssignmentTypeORM.createTypeORM(updatedFields, classModel));

        return updatedFields;
    }
}
