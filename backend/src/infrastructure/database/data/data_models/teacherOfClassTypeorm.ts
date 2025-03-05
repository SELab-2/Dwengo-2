import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { TeacherTypeORM } from "./teacherTypeorm"
import { ClassTypeORM } from "./classTypeorm"

@Entity()
export class TeacherOfClassTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => TeacherTypeORM)
    @JoinColumn({ name: "teacher_id" })
    teacher!: TeacherTypeORM

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date
}
