import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from "typeorm"
import { Assignment } from "./assignment"
import { Student } from "./student"
import { AssignmentAnswer } from "./assignment_answer"
import { QuestionThread } from "./question_thread"

export enum StudentProgressStatus {
    NOT_DONE = "not_done",
    BUSY = "busy",
    DONE = "done"
}

@Entity()
export class StudentProgress {
    @PrimaryColumn()
    super_so_uuid!: string

    @PrimaryColumn()
    so_uuid!: string

    @OneToOne(() => Assignment)
    @JoinColumn({ name: "assignment_id" })
    assignment!: Assignment

    @OneToOne(() => Student)
    @JoinColumn({ name: "student_id" })
    student!: Student

    @OneToOne(() => QuestionThread)
    @JoinColumn({ name: "question_thread_id" })
    question_thread!: QuestionThread

    @OneToOne(() => AssignmentAnswer)
    @JoinColumn({ name: "answer_id" })
    answer!: AssignmentAnswer

    @Column({
        type: "enum",
        enum: StudentProgressStatus,
        default: StudentProgressStatus.NOT_DONE
    })
    progress_status!: StudentProgressStatus
}
