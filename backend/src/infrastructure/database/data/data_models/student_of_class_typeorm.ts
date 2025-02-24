import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Student } from "./student_typeorm"
import { Class } from "./class_typeorm"

@Entity()
export class StudentOfClass {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Student)
    @JoinColumn({ name: "student_id" })
    student!: Student

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date
}
