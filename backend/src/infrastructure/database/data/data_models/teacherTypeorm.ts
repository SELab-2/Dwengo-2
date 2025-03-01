import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { Teacher } from "../../../../core/entities/teacher"
import { User } from "../../../../core/entities/user"

@Entity()
export class TeacherTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "user_id" })
    teacher!: UserTypeORM

    public static createTeacherTypeORM(teacher: Teacher, correspondingUser: UserTypeORM): TeacherTypeORM {
        const teacherTypeORM: TeacherTypeORM = new TeacherTypeORM();
        teacherTypeORM.teacher = correspondingUser;
        return teacherTypeORM;
    }

    public toTeacherEntity(userModel: UserTypeORM): Teacher {
        return new Teacher(
            this.id, // Important that it's the id from the Teacher table and not User!
            userModel.email,
            userModel.first_name,
            userModel.family_name,
            userModel.password_hash,
            userModel.name_school,
        );
    }
}
