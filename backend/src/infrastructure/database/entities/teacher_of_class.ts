import { Entity, PrimaryColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Teacher } from "./teacher"
import { Class } from "./class"

@Entity()
export class TeacherOfClass {
    @PrimaryColumn()
    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher!: Teacher

    @PrimaryColumn()
    @OneToOne(() => Class)
    @JoinColumn()
    class!: Class

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date
}
