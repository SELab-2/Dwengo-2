import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { TeacherTypeORM } from "./teacherTypeorm"
import { AssignmentTypeORM } from "./assignmentTypeorm"

@Entity()
export class TeacherGroupAssignment {
    @PrimaryGeneratedColumn()

    @OneToOne(() => TeacherTypeORM)
    @JoinColumn({ name: "teacher_id" })
    teacher!: TeacherTypeORM

    @OneToOne(() => AssignmentTypeORM)
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM
}
