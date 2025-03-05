import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { Teacher } from "../../../../core/entities/teacher"

@Entity()
export class TeacherTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => UserTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    teacher!: UserTypeORM

    // Since multiple constructors isn't supported by Typescript:
    // https://stackoverflow.com/questions/12702548/constructor-overload-in-typescript
    public static createTeacherTypeORM(teacher: Teacher, correspondingUser: UserTypeORM): TeacherTypeORM {
        const teacherTypeORM: TeacherTypeORM = new TeacherTypeORM();
        teacherTypeORM.teacher = correspondingUser;
        return teacherTypeORM;
    }

    public toTeacherEntity(userModel: UserTypeORM): Teacher {
        return new Teacher(
            userModel.email,
            userModel.first_name,
            userModel.last_name,
            userModel.password_hash,
            userModel.school_name,
            this.id, // Important that it's the id from the Teacher table and not User!
        );
    }
}
