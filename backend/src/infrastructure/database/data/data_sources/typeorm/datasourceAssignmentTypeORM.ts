import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { AssignmentTypeORM as Assignment } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";

export class DatasourceAssignmentTypeORM extends DatasourceTypeORM {
    //TODO: classId can be removed
    public async createAssignment(newAssignment: Assignment, classId: string): Promise<Assignment> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // Check if the class exists
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: newAssignment.class.id } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        // Class exists and teacher exist: insert assignment into the database
        const assignmentModel = datasource.getRepository(Assignment).create(newAssignment);

        await datasource.getRepository(Assignment).save(assignmentModel);

        return assignmentModel;
    }

    public async getAssignmentById(id: string): Promise<Assignment> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModel: Assignment | null = await datasource.getRepository(Assignment).findOne({
            where: { id: id },
            relations: ["class"],
        });
        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${id} not found`);
        }

        return assignmentModel;
    }

    public async getAssignmentsByClassId(classId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModels: Assignment[] = await datasource.getRepository(Assignment).find({
            where: { class: { id: classId } },
            relations: ["class"],
        });

        return assignmentModels;
    }

    public async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentsJoinResult = await datasource
            .getRepository(StudentOfGroupTypeORM)
            .createQueryBuilder()
            .where("StudentOfGroupTypeORM.user = :id", { id: userId })
            // Join StudentOfGroup
            .leftJoinAndSelect("StudentOfGroupTypeORM.group", "group") // Last one is alias
            // Join Group to AssignmentGroup
            .leftJoinAndSelect("group.assignment", "assignment")
            // Join Assignment to Class
            .leftJoinAndSelect("assignment.class", "class")
            .getMany();

        return assignmentsJoinResult.map(assignmentJoinResult => {
            return assignmentJoinResult.group.assignment;
        });
    }

    public async getAssignmentsByLearningPathId(learningPathId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModels: Assignment[] = await datasource.getRepository(Assignment).find({
            where: { learningPathId: learningPathId },
            relations: ["class"],
        });

        return assignmentModels;
    }

    public async deleteAssignmentById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        await datasource.getRepository(Assignment).delete(id);
    }

    public async updateAssignmentById(updatedFields: Assignment): Promise<Assignment> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: ClassTypeORM | null = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: updatedFields.class.id },
        });

        if (!classModel) {
            throw new EntityNotFoundError("Class not found");
        }

        await datasource.getRepository(Assignment).save(updatedFields);

        return updatedFields;
    }
}
