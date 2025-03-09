import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { Student } from "../../../../core/entities/student";

@Entity()
export class StudentTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "user_id" })
    student!: UserTypeORM

    public toStudentEntity(userModel: UserTypeORM): Student {
        return new Student(
            userModel.email,
            userModel.first_name,
            userModel.last_name,
            userModel.password_hash,
            userModel.school_name,
            this.id, // Important that it's the id from the Student table and not User!
        );
    }
}
