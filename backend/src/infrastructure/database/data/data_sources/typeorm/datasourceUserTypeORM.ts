import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Student } from "../../../../../core/entities/student";
import { Teacher } from "../../../../../core/entities/teacher";
import { User } from "../../../../../core/entities/user";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { UserOfClassTypeORM } from "../../data_models/userOfClassTypeorm";
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
        return userModel.role == UserType.STUDENT
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

        const userOfClass: UserOfClassTypeORM | null = await datasource.getRepository(UserOfClassTypeORM).findOne({
            where: { user: userModel, class: classModel },
            relations: ["class"],
        });

        if (!userOfClass || userOfClass.class.id !== classId) {
            throw new EntityNotFoundError("Student not part of class");
        }

        await datasource.getRepository(UserOfClassTypeORM).delete(userOfClass);
    }

    public async removeStudentFromGroup(studentId: string, groupId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: studentId, role: UserType.STUDENT },
        });

        if (!userModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }

        const studentOfGroup: StudentOfGroupTypeORM | null = await datasource
            .getRepository(StudentOfGroupTypeORM)
            .findOne({
                where: { user: userModel },
                relations: ["group"],
            });

        if (!studentOfGroup || studentOfGroup.group.id !== groupId) {
            throw new EntityNotFoundError("Student not part of group");
        }

        await datasource.getRepository(StudentOfGroupTypeORM).delete(studentOfGroup);
    }

    public async assignStudentToGroup(studentId: string, groupId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupModel: GroupTypeORM | null = await datasource
            .getRepository(GroupTypeORM)
            .findOne({ where: { id: groupId } });

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id ${groupId} not found`);
        }

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { id: studentId, role: UserType.STUDENT } });

        if (!userModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }

        const studentOfGroup: StudentOfGroupTypeORM = new StudentOfGroupTypeORM();
        studentOfGroup.user = userModel;
        studentOfGroup.group = groupModel;

        await datasource.getRepository(StudentOfGroupTypeORM).save(studentOfGroup);
    }

    public async getClassStudents(classId: string): Promise<Student[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const classJoinResult: UserOfClassTypeORM[] = await datasource
            .getRepository(UserOfClassTypeORM)
            .createQueryBuilder("userOfClass")
            .leftJoinAndSelect("userOfClass.user", "usr")
            .where("userOfClass.class.id = :classId", { classId: classId })
            .getMany();

        // Map the users to entities
        const users: User[] = classJoinResult.map(classJoinResult => {
            if (classJoinResult.user.role == UserType.TEACHER) {
                return classJoinResult.user.toEntity() as Teacher;
            } else {
                return classJoinResult.user.toEntity() as Student;
            }
        });

        // filter out all teachers in the result
        const students = users.filter(user => {
            return user instanceof Student;
        });

        return students;
    }

    public async getClassTeachers(classId: string): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const classJoinResult: UserOfClassTypeORM[] = await datasource
            .getRepository(UserOfClassTypeORM)
            .createQueryBuilder("userOfClass")
            .leftJoinAndSelect("userOfClass.user", "usr")
            .where("userOfClass.class.id = :classId", { classId: classId })
            .getMany();

        // Map the users to entities
        const users: User[] = classJoinResult.map(classJoinResult => {
            if (classJoinResult.user.role == UserType.TEACHER) {
                return classJoinResult.user.toEntity() as Teacher;
            } else {
                return classJoinResult.user.toEntity() as Student;
            }
        });

        // filter out all teachers in the result
        const teachers = users.filter(user => {
            return user instanceof Teacher;
        });

        return teachers;
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

        // Check if group exists
        const groupRepo = await datasource.getRepository(GroupTypeORM);
        if (!(await groupRepo.findOneBy({ id: groupId }))) {
            throw new EntityNotFoundError("Group not Found");
        }

        const groupJoinResult = await datasource
            .getRepository(StudentOfGroupTypeORM)
            .createQueryBuilder("studentOfGroup")
            .leftJoinAndSelect("studentOfGroup.user", "user")
            .where("studentOfGroup.group.id = :groupId", { groupId: groupId })
            .getMany();
        return groupJoinResult.map(groupJoinResult => {
            return groupJoinResult.user.toEntity();
        });
    }
}
