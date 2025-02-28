import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { Teacher } from "../../../../core/entities/teacher"

@Entity()
export class TeacherTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "user_id" })
    teacher!: UserTypeORM

    public constructor(teacherUserObject: UserTypeORM) {
        this.teacher = teacherUserObject
    }

    public toTeacherEntity(userModel: UserTypeORM): Teacher {
        return new Teacher(
            userModel.id,
            userModel.email,
            userModel.first_name,
            userModel.family_name,
            userModel.password_hash,
            userModel.name_school,
        )
    }
}
