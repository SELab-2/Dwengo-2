import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Student } from "./studentTypeorm"
import { ClassTypeORM } from "./classTypeorm"

@Entity()
export class StudentOfClass {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Student)
    @JoinColumn({ name: "student_id" })
    student!: Student

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date
}
