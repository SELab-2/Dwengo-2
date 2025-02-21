import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { Teacher } from "./teacher"
import { Assignment } from "./assignment"

@Entity()
export class TeacherGroupAssignment {
    @PrimaryColumn()
    @OneToOne(() => Teacher)
    @JoinColumn()
    teacher!: Teacher

    @PrimaryColumn()
    @OneToOne(() => Assignment)
    @JoinColumn()
    class!: Assignment
}
