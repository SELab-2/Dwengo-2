import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Assignment } from "../../../../../core/entities/assignment";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";
import { UserOfClassTypeORM } from "../../data_models/userOfClassTypeorm";
import { SimpleConsoleLogger } from "typeorm";

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

    public async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({
                where: { id: userId },
            });

        console

        if(!userModel) {
            throw new EntityNotFoundError(`User with id ${userId} not found`);
        }


        if(userModel.role === UserType.STUDENT){
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
                return assignmentJoinResult.group.assignment.toAssignmentEntity();
            });
        }

        const assignments = await datasource
            .getRepository(AssignmentTypeORM)
            .createQueryBuilder("assignment")
            .leftJoinAndSelect("assignment.class", "class")
            .leftJoin(UserOfClassTypeORM, "userOfClass", "userOfClass.class = class.id")
            .where("userOfClass.user = :id", { id: userId })
            .getMany();

        console.log(assignments);
        
        return assignments.map(assignment => {
            return assignment.toAssignmentEntity();
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
