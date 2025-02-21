import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from "typeorm"
import { Assignment } from "./assignment"
import { Student } from "./student"
import { StudentQuestion } from "./student_question"
import { AssignmentAnswer } from "./assignment_answer"

export enum StudentProgressStatus {
    NOT_DONE = "not_done",
    BUSY = "busy",
    DONE = "done"
}

@Entity()
export class StudentProgress {
    @PrimaryColumn()
    super_so_uuid: string

    @PrimaryColumn()
    so_uuid: string

    @OneToOne(() => Assignment)
    @JoinColumn()
    assignment: Assignment

    @OneToOne(() => Student)
    @JoinColumn()
    student: Student

    @OneToOne(() => StudentQuestion)
    @JoinColumn({ nullable: true }) // TODO: hope this works
    question: StudentQuestion

    @OneToOne(() => Student)
    @JoinColumn({ nullable: true })
    answer: AssignmentAnswer

    @Column({
        type: "enum",
        enum: StudentProgressStatus,
        default: StudentProgressStatus.NOT_DONE
    })
    progress_status: StudentProgressStatus
}
