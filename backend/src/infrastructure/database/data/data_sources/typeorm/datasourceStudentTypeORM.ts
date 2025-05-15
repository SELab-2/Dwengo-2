import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Student } from "../../../../../core/entities/student";
import { Teacher } from "../../../../../core/entities/teacher";
import { User } from "../../../../../core/entities/user";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { UserOfClassTypeORM } from "../../data_models/userOfClassTypeorm";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceStudentTypeORM extends DatasourceTypeORM {
    public async createStudent(student: Student): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(student));

        return userModel.toEntity() as Student;
    }

    public async getStudentById(id: string): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const studentModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: id, role: UserType.STUDENT },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${id} not found`);
        }
        return studentModel.toEntity() as Student;
    }

    public async getStudentByEmail(email: string): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email, role: UserType.STUDENT } });

        if (!userModel) {
            throw new EntityNotFoundError(`Student with email ${email} not found`);
        }
        return userModel.toEntity() as Student;
    }

    public async getStudentByFirstName(first_name: string): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name, role: UserType.STUDENT } });

        if (!userModel) {
            throw new EntityNotFoundError(`Student with first name ${first_name} not found`);
        }
        return userModel.toEntity() as Student;
    }

    public async getStudentByLastName(last_name: string): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name, role: UserType.STUDENT } });

        if (!userModel) {
            throw new EntityNotFoundError(`Student with last name ${last_name} not found`);
        }
        return userModel.toEntity() as Student;
    }

    public async getAllStudents(): Promise<Student[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModels: UserTypeORM[] = await datasource
            .getRepository(UserTypeORM)
            .find({ where: { role: UserType.STUDENT } });

        return studentModels.map((studentModel: UserTypeORM) => studentModel.toEntity() as Student);
    }

    public async updateStudent(student: Student): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: student.id, role: UserType.STUDENT },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${student.id} not found`);
        }

        await datasource.getRepository(UserTypeORM).update(studentModel.id!, UserTypeORM.createUserTypeORM(student));

        return student;
    }

    public async deleteStudentWithId(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: id, role: UserType.STUDENT },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${id} not found`);
        }

        await datasource.getRepository(UserTypeORM).delete(studentModel.id);
    }

    public async removeStudentFromClass(studentId: string, classId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: ClassTypeORM | null = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: classId },
        });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        const studentModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: studentId, role: UserType.STUDENT },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }

        const studentOfClass: UserOfClassTypeORM | null = await datasource.getRepository(UserOfClassTypeORM).findOne({
            where: { user: studentModel, class: classModel },
            relations: ["class"],
        });

        if (!studentOfClass || studentOfClass.class.id !== classId) {
            throw new EntityNotFoundError("Student not part of class");
        }

        await datasource.getRepository(UserOfClassTypeORM).delete(studentOfClass);
    }

    public async removeStudentFromGroup(studentId: string, groupId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const groupRepository = datasource.getRepository(GroupTypeORM)

        const studentModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: studentId, role: UserType.STUDENT },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }

        const groupModel: GroupTypeORM | null = await groupRepository
            .findOne({
                where: { id: groupId },
                relations: ['students']
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

        const groupModel: GroupTypeORM | null = await groupRepository
            .findOne({
                where: { id: groupId },
                relations: ['students']
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
        /*
        // Find out if the student is already in the group
        if (groupModel.students.find(studentModel => studentModel.id == studentId)){
            return;
        }
        */

        groupModel.students.push(studentModel);
        console.log(groupModel.students);
        await groupRepository.save(groupModel);
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

        const groupModel: GroupTypeORM | null = await groupRepository
            .findOne({
                where: { id: groupId },
                relations: ['students']
            });
        
        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id ${groupId} not found`);
        }

        return groupModel.students.map(studentModel => studentModel.toEntity());
    }
}
