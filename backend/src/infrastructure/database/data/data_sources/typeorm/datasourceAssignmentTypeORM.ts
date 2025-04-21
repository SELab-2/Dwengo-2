import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Assignment } from "../../../../../core/entities/assignment";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";

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
        const assignmentModel: AssignmentTypeORM = datasource.getRepository(AssignmentTypeORM).create({
            class: { id: newAssignment.classId },
            learning_path_id: newAssignment.learningPathId,
            start: newAssignment.startDate,
            deadline: newAssignment.deadline,
            name: newAssignment.name,
            extra_instructions: newAssignment.extraInstructions,
        });

        await datasource.getRepository(AssignmentTypeORM).save(assignmentModel);

        return assignmentModel.toAssignmentEntity();
    }

    public async getAssignmentById(id: string): Promise<Assignment | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModel: AssignmentTypeORM | null = await datasource.getRepository(AssignmentTypeORM).findOne({
            where: { id: id },
            relations: ["class"],
        });

        if (assignmentModel !== null) {
            return assignmentModel.toAssignmentEntity();
        }
        return null;
    }

    public async getAssignmentsByClassId(classId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModels: AssignmentTypeORM[] = await datasource.getRepository(AssignmentTypeORM).find({
            where: { class: { id: classId } },
            relations: ["class"],
        });

        return assignmentModels.map((assignmentModel: AssignmentTypeORM) => assignmentModel.toAssignmentEntity());
    }

    public async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentsJoinResult = await datasource
            .getRepository(StudentOfGroupTypeORM)
            .createQueryBuilder()
            .where("StudentOfGroupTypeORM.student = :id", { id: userId })
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
