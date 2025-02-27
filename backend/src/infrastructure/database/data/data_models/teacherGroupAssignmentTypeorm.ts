import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Teacher } from "./teacher_typeorm"
import { Assignment } from "./assignment_typeorm"

@Entity()
export class TeacherGroupAssignment {
    @PrimaryGeneratedColumn()

    @OneToOne(() => Teacher)
    @JoinColumn({ name: "teacher_id" })
    teacher!: Teacher

    @OneToOne(() => Assignment)
    @JoinColumn({ name: "assignment_id" })
    assignment!: Assignment
}
