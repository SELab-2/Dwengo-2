import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Student } from "../../../../../core/entities/student";
import { Teacher } from "../../../../../core/entities/teacher";
import { User } from "../../../../../core/entities/user";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceUserTypeORM extends DatasourceTypeORM {
    public async createUser(user: User): Promise<User> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(user));

        return userModel.role == UserType.STUDENT
            ? (userModel.toEntity() as Student)
            : (userModel.toEntity() as Teacher);
    }

    public async getUserById(id: string): Promise<User> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const userModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: id },
        });

        if (!userModel) {
            throw new EntityNotFoundError(`User with id ${id} not found`);
        }

        return userModel.role == UserType.STUDENT
            ? (userModel.toEntity() as Student)
            : (userModel.toEntity() as Teacher);
    }

    public async getUserByEmail(email: string): Promise<User> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email } });

        if (!userModel) {
            throw new EntityNotFoundError(`User with email ${email} not found`);
        }
        return userModel.role == UserType.STUDENT
            ? (userModel.toEntity() as Student)
            : (userModel.toEntity() as Teacher);
    }

    public async getUserByFirstName(first_name: string): Promise<User> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name } });

        if (!userModel) {
            throw new EntityNotFoundError(`User with first name ${first_name} not found`);
        }
        return userModel.role == UserType.STUDENT
            ? (userModel.toEntity() as Student)
            : (userModel.toEntity() as Teacher);
    }

    public async getUserByLastName(last_name: string): Promise<User> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name } });

        if (!userModel) {
            throw new EntityNotFoundError(`User with last name ${last_name} not found`);
        }
        return userModel.role === UserType.STUDENT
            ? (userModel.toEntity() as Student)
            : (userModel.toEntity() as Teacher);
    }

    public async getAllStudents(): Promise<Student[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModels: UserTypeORM[] = await datasource
            .getRepository(UserTypeORM)
            .find({ where: { role: UserType.STUDENT } });

        return userModels.map((userModel: UserTypeORM) => userModel.toEntity() as Student);
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModels: UserTypeORM[] = await datasource
            .getRepository(UserTypeORM)
            .find({ where: { role: UserType.TEACHER } });

        return teacherModels.map((teacherModel: UserTypeORM) => teacherModel.toEntity() as Teacher);
    }

    public async updateUser(user: User): Promise<User> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: user.id },
        });

        if (!userModel) {
            throw new EntityNotFoundError(`User with id ${user.id} not found`);
        }

        await datasource.getRepository(UserTypeORM).update(userModel.id!, UserTypeORM.createUserTypeORM(user));

        return user;
    }

    public async deleteUserWithId(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: id },
        });

        if (!userModel) {
            throw new EntityNotFoundError(`User with id ${id} not found`);
        }

        await datasource.getRepository(UserTypeORM).delete(userModel.id);
    }

    public async removeUserFromClass(userId: string, classId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: ClassTypeORM | null = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: classId },
            relations: { members: true },
        });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        const userModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: userId },
        });

        if (!userModel) {
            throw new EntityNotFoundError(`User with id ${userId} not found`);
        }

        const originalClassSize = classModel.members.length;

        classModel.members = classModel.members.filter(userModel => userModel.id != userId);

        if (originalClassSize == classModel.members.length) {
            throw new EntityNotFoundError("User not part of class");
        }

        await datasource.getRepository(ClassTypeORM).save(classModel);
    }

    public async removeStudentFromGroup(studentId: string, groupId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const groupRepository = datasource.getRepository(GroupTypeORM);

        const studentModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: studentId, role: UserType.STUDENT },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }

        const groupModel: GroupTypeORM | null = await groupRepository.findOne({
            where: { id: groupId },
            relations: ["students"],
        });

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id ${groupId} not found`);
        }

        const groupSize = groupModel.students.length;

        // Filter out the student with studentId
        groupModel.students = groupModel.students.filter(studentModel => studentModel.id != studentId);

        if (groupSize == groupModel.students.length) {
            throw new EntityNotFoundError("Student not part of group");
        }

        await groupRepository.save(groupModel);
    }

    public async assignStudentToGroup(studentId: string, groupId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const groupRepository = datasource.getRepository(GroupTypeORM);

        const groupModel: GroupTypeORM | null = await groupRepository.findOne({
            where: { id: groupId },
            relations: ["students"],
        });

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id ${groupId} not found`);
        }

        const studentModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { id: studentId, role: UserType.STUDENT } });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }

        groupModel.students.push(studentModel);

        await groupRepository.save(groupModel);
    }

    public async getClassStudents(classId: string): Promise<Student[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: classId },
            relations: { members: true },
        });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        // Only return the students of the class.
        const studentModels: UserTypeORM[] = classModel.members.filter(userModel => userModel.role == UserType.STUDENT);
        return studentModels.map(studentModel => studentModel.toEntity());
    }

    public async getClassTeachers(classId: string): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: classId },
            relations: { members: true },
        });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        // Only return the teachers of the class.
        const studentModels: UserTypeORM[] = classModel.members.filter(userModel => userModel.role == UserType.TEACHER);
        return studentModels.map(studentModel => studentModel.toEntity());
    }

    public async getAssignmentStudents(assignmentId: string): Promise<Student[]> {
        // TODO change this method to actually give the students that have this assignment,
        // not just the students that are in the class of the assignment.

        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentModel: AssignmentTypeORM | null = await datasource.getRepository(AssignmentTypeORM).findOne({
            where: { id: assignmentId },
            relations: ["class"],
        });

        if (!assignmentModel) throw new EntityNotFoundError("Assignment not Found");
        else return await this.getClassStudents(assignmentModel.class.id);
    }

    public async getGroupStudents(groupId: string): Promise<Student[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const groupRepository = datasource.getRepository(GroupTypeORM);

        const groupModel: GroupTypeORM | null = await groupRepository.findOne({
            where: { id: groupId },
            relations: ["students"],
        });

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id ${groupId} not found`);
        }

        return groupModel.students.map(studentModel => studentModel.toEntity());
    }
}
