import { Entity, PrimaryColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Student } from "./student.ts"
import { Class } from "./class.ts"

@Entity()
export class StudentOfClass {
    @PrimaryColumn()
    @OneToOne(type => Student)
    @JoinColumn()
    student: Student

    @PrimaryColumn()
    @OneToOne(type => Class)
    @JoinColumn()
    class: Class

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since: Date
}
