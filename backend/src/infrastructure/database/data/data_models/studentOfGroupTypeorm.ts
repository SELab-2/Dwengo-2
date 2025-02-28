import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Student } from "./studentTypeorm"
import { ClassTypeORM } from "./classTypeorm"

@Entity()
export class StudentOfGroup {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Student)
    @JoinColumn({ name: "student_id" })
    student!: Student

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    @CreateDateColumn()
    since!: Date
}
