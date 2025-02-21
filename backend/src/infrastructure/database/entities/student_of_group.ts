import { Entity, PrimaryColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Student } from "./student"
import { Class } from "./class"

@Entity()
export class StudentOfGroup {
    @PrimaryColumn()
    @OneToOne(type => Student)
    @JoinColumn()
    student!: Student

    @PrimaryColumn()
    @OneToOne(type => Class)
    @JoinColumn()
    class!: Class

    @CreateDateColumn()
    since!: Date
}
