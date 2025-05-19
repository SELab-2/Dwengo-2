import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Assignment } from "../../../../../core/entities/assignment";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";

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
        const groupRepository = datasource.getRepository(GroupTypeORM);
        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);

        const userModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: userId },
        });

        if (!userModel) {
            throw new EntityNotFoundError(`User with id ${userId} not found`);
        }

        if (userModel.role == UserType.STUDENT) {
            // The user is a student
            // Get all the assignments for each group the student is in
            const groupModels: GroupTypeORM[] = await groupRepository.find({
                where: {
                    students: {
                        id: userId,
                    },
                },
                relations: {
                    assignment: { class: true }, // Important that the class is also loaded, as this is needed to convert the assignment to an entity
                },
            });

            return groupModels.map(model => model.assignment.toAssignmentEntity());
        }
        // The user is a teacher
        // Get all the assignments for which the teacher is in the class
        const assignmentModels: AssignmentTypeORM[] = await assignmentRepository.find({
            where: {
                class: {
                    members: {
                        id: userId,
                    },
                },
            },
            relations: {
                class: true, // Important that the class is also loaded, as this is needed to convert the assignment to an entity
            },
        });
        return assignmentModels.map(assignmentModel => assignmentModel.toAssignmentEntity());
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
