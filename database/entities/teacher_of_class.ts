import { Entity, PrimaryColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Teacher } from "./teacher.ts"
import { Class } from "./class.ts"

@Entity()
export class TeacherOfClass {
    @PrimaryColumn()
    @OneToOne(type => Teacher)
    @JoinColumn()
    teacher: Teacher

    @PrimaryColumn()
    @OneToOne(type => Class)
    @JoinColumn()
    class: Class

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since: Date
}
