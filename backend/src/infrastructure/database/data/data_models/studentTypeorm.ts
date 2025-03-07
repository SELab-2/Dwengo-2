import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { Student } from "../../../../core/entities/student"

@Entity()
export class StudentTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "user_id" })
    student!: UserTypeORM

    // Since multiple constructors isn't supported by Typescript:
    // https://stackoverflow.com/questions/12702548/constructor-overload-in-typescript
    public static createStudentTypeORM(student: Student, correspondingUser: UserTypeORM): StudentTypeORM {
        const studentTypeORM: StudentTypeORM = new StudentTypeORM();
        studentTypeORM.student = correspondingUser;
        return studentTypeORM;
    }

    public toStudentEntity(userModel: UserTypeORM): Student {
        return new Student(
            userModel.email,
            userModel.first_name,
            userModel.last_name,
            userModel.password_hash,
            this.id, // Important that it's the id from the Student table and not User!
        );
    }
}
