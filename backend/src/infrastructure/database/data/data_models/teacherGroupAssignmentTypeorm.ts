import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { TeacherTypeORM } from "./teacherTypeorm";

@Entity()
export class TeacherGroupAssignmentTypeORM {
    @PrimaryGeneratedColumn()
    @OneToOne(() => TeacherTypeORM)
    @JoinColumn({ name: "teacher_id" })
    teacher!: TeacherTypeORM;

    @OneToOne(() => AssignmentTypeORM)
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM;
}
