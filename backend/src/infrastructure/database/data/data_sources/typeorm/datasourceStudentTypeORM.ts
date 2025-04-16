import { DatasourceTypeORM } from "./datasourceTypeORM";
import { DatabaseEntryNotFoundError, EntityNotFoundError } from "../../../../../config/error";
import { Student } from "../../../../../core/entities/student";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceStudentTypeORM extends DatasourceTypeORM {
    public async createStudent(student: Student): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(student));

        const studentModel: StudentTypeORM = await datasource
            .getRepository(StudentTypeORM)
            .save(StudentTypeORM.createStudentTypeORM(student, userModel));

        return studentModel.toStudentEntity(studentModel.student);
    }

    public async getStudentById(id: string): Promise<Student | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: id },
            relations: ["student"],
        });

        if (!studentModel) {
            return null;
        }
        return studentModel.toStudentEntity(studentModel.student);
    }

    public async getStudentByEmail(email: string): Promise<Student | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email } });

        if (!userModel) {
            return null;
        }
        const studentModel: StudentTypeORM | null = await datasource
            .getRepository(StudentTypeORM)
            .findOne({ where: { student: userModel } });

        if (!studentModel) {
            return null;
        }
        return studentModel.toStudentEntity(userModel);
    }

    public async getStudentByFirstName(first_name: string): Promise<Student | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name } });

        if (!userModel) {
            return null;
        }
        const studentModel: StudentTypeORM | null = await datasource
            .getRepository(StudentTypeORM)
            .findOne({ where: { student: userModel } });

        if (!studentModel) {
            return null;
        }
        return studentModel.toStudentEntity(userModel);
    }

    public async getStudentByLastName(last_name: string): Promise<Student | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name } });

        if (!userModel) {
            return null;
        }
        const studentModel: StudentTypeORM | null = await datasource
            .getRepository(StudentTypeORM)
            .findOne({ where: { student: userModel } });

        if (!studentModel) {
            return null;
        }
        return studentModel.toStudentEntity(userModel);
    }

    public async getAllStudents(): Promise<Student[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModels: StudentTypeORM[] = await datasource
            .getRepository(StudentTypeORM)
            .find({ relations: ["student"] });

        return studentModels.map((studentModel: StudentTypeORM) => studentModel.toStudentEntity(studentModel.student));
    }

    public async updateStudent(student: Student): Promise<Student> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: student.id },
            relations: ["student"],
        });

        if (!studentModel) {
            throw new EntityNotFoundError("Student does not exist");
        }

        await datasource
            .getRepository(UserTypeORM)
            .update(studentModel.student.id!, UserTypeORM.createUserTypeORM(student));

        return student;
    }

    public async deleteStudentWithId(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: id },
            relations: ["student"],
        });

        if (!studentModel) {
            throw new EntityNotFoundError("Student does not exist");
        }

        // First, delete the student record
        await datasource.getRepository(StudentTypeORM).delete(studentModel.id);

        // Manually delete the associated user if needed
        if (studentModel.student?.id) {
            await datasource.getRepository(UserTypeORM).delete(studentModel.student.id);
        }
    }

    public async removeStudentFromClass(studentId: string, classId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: studentId },
        });

        if (!studentModel) {
            throw new EntityNotFoundError("Student does not exist");
        }

        const studentOfClass: StudentOfClassTypeORM | null = await datasource
            .getRepository(StudentOfClassTypeORM)
            .findOne({
                where: { student: studentModel },
                relations: ["class"],
            });

        if (!studentOfClass || studentOfClass.class.id !== classId) {
            throw new DatabaseEntryNotFoundError("Student not part of class");
        }

        await datasource.getRepository(StudentOfClassTypeORM).delete(studentOfClass);
    }

    public async removeStudentFromGroup(studentId: string, groupId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: studentId },
        });

        if (!studentModel) {
            throw new EntityNotFoundError("Student does not exist");
        }

        const studentOfGroup: StudentOfGroupTypeORM | null = await datasource
            .getRepository(StudentOfGroupTypeORM)
            .findOne({
                where: { student: studentModel },
                relations: ["group"],
            });

        if (!studentOfGroup || studentOfGroup.group.id !== groupId) {
            throw new DatabaseEntryNotFoundError("Student not part of group");
        }

        await datasource.getRepository(StudentOfGroupTypeORM).delete(studentOfGroup);
    }

    public async assignStudentToGroup(studentId: string, groupId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupModel: GroupTypeORM | null = await datasource
            .getRepository(GroupTypeORM)
            .findOne({ where: { id: groupId } });

        if (!groupModel) {
            throw new EntityNotFoundError("Group does not exist");
        }

        const studentModel: StudentTypeORM | null = await datasource
            .getRepository(StudentTypeORM)
            .findOne({ where: { id: studentId } });

        if (!studentModel) {
            throw new EntityNotFoundError("User does not exist");
        }

        const studentOfGroup: StudentOfGroupTypeORM = new StudentOfGroupTypeORM();
        studentOfGroup.student = studentModel;
        studentOfGroup.group = groupModel;

        await datasource.getRepository(StudentOfGroupTypeORM).save(studentOfGroup);
    }

    public async getClassStudents(classId: string): Promise<Student[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classJoinResult: StudentOfClassTypeORM[] = await datasource
            .getRepository(StudentOfClassTypeORM)
            .createQueryBuilder("studentOfClass")
            .leftJoinAndSelect("studentOfClass.student", "student")
            .leftJoinAndSelect("student.student", "user") // Fetch the related UserTypeORM entity
            .where("studentOfClass.class.id = :classId", { classId: classId })
            .getMany();

        return classJoinResult.map(classJoinResult => {
            return classJoinResult.student.toStudentEntity(classJoinResult.student.student);
        });
    }

    public async getAssignmentStudents(assignmentId: string): Promise<Student[]> {
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
        if (! await groupRepo.findOneBy({ id: groupId })) {
            throw new EntityNotFoundError("Group not Found");
        }

        const groupJoinResult = await datasource
            .getRepository(StudentOfGroupTypeORM)
            .createQueryBuilder("studentOfGroup")
            .leftJoinAndSelect("studentOfGroup.student", "student")
            .leftJoinAndSelect("student.student", "user")
            .where("studentOfGroup.group.id = :groupId", { groupId: groupId })
            .getMany();
        console.log(groupJoinResult)
        return groupJoinResult.map(groupJoinResult => {
            return groupJoinResult.student.toStudentEntity(groupJoinResult.student.student);
        });
    }
}
