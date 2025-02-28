import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Student } from "./studentTypeorm"
import { Class } from "./classTypeorm"

@Entity()
export class StudentOfGroup {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Student)
    @JoinColumn({ name: "student_id" })
    student!: Student

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class

    @CreateDateColumn()
    since!: Date
}
