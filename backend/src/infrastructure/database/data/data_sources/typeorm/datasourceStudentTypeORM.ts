import { IDatasourceStudent } from "../datasourceStudentInterface";
import { Student } from "../../../../../core/entities/student";
import { UserTypeORM } from "../../data_models/userTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";

export class DatasourceStudentTypeORM extends IDatasourceStudent {

    public async createStudent(student: Student): Promise<Student> {
        const userModel: UserTypeORM = await this.datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(student));

        const studentModel: StudentTypeORM = await this.datasource
            .getRepository(StudentTypeORM)
            .save(StudentTypeORM.createStudentTypeORM(student, userModel));

        return studentModel.toStudentEntity(studentModel.student);
    }

    public async getStudentById(id: string): Promise<Student|null> {
        const studentModel: StudentTypeORM | null = await this.datasource
            .getRepository(StudentTypeORM)
            .findOne({ 
                where: { id: id },
                relations: ["student"]
            });

        if (studentModel !== null) {
            const t: Student = studentModel.toStudentEntity(studentModel.student);
            console.log(t);
            return t;
        }
        return null; // No result
    }

    public async getStudentByEmail(email: string): Promise<Student|null> {
        const userModel: UserTypeORM|null = await this.datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email } });

        if (userModel !== null) {
            const studentModel: StudentTypeORM|null = await this.datasource
                .getRepository(StudentTypeORM)
                .findOne({ where: { student: userModel } });

            if (studentModel !== null) {
                return studentModel.toStudentEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getStudentByFirstName(first_name: string): Promise<Student|null> {
        const userModel: UserTypeORM|null = await this.datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name } });

        if (userModel !== null) {
            const studentModel: StudentTypeORM|null = await this.datasource
                .getRepository(StudentTypeORM)
                .findOne({ where: { student: userModel } });

            if (studentModel !== null) {
                return studentModel.toStudentEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getStudentByLastName(last_name: string): Promise<Student | null> {
        const userModel: UserTypeORM | null = await this.datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name } });

        if (userModel !== null) {
            const studentModel: StudentTypeORM | null = await this.datasource
                .getRepository(StudentTypeORM)
                .findOne({ where: { student: userModel } });

            if (studentModel !== null) {
                return studentModel.toStudentEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getAllStudents(): Promise<Student[]> {
        const studentModels: StudentTypeORM[] = await this.datasource
            .getRepository(StudentTypeORM)
            .find({ relations: ["student"] });

        return studentModels.map((studentModel: StudentTypeORM) => studentModel.toStudentEntity(studentModel.student));
    }

    public async updateStudent(student: Student): Promise<Student> {
        await this.datasource.getRepository(UserTypeORM).update(student.id!, UserTypeORM.createUserTypeORM(student));
        
        // For now, there is no need to update the Student table

        return student;
    }

    public async deleteStudentWithId(id: string): Promise<void> {
        const studentModel: StudentTypeORM | null = await this.datasource
            .getRepository(StudentTypeORM)
            .findOne({ 
                where: { id: id },
                relations: ["student"]
            });

        // TODO: check if studentModel!.student.id! is not null

        if(studentModel && studentModel.student.id) {
            await this.datasource.getRepository(UserTypeORM).delete(studentModel!.student.id!);
            await this.datasource.getRepository(StudentTypeORM).delete(id);
        }
    }

}
