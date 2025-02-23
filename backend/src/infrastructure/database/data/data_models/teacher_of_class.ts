import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Teacher } from "./teacher"
import { Class } from "./class"

@Entity()
export class TeacherOfClass {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Teacher)
    @JoinColumn({ name: "teacher_id" })
    teacher!: Teacher

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date
}
