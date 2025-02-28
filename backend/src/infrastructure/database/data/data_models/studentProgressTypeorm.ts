import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from "typeorm"
import { Assignment } from "./assignmentTypeorm"
import { Student } from "./studentTypeorm"
import { AssignmentAnswer } from "./assignmentAnswerTypeorm"
import { QuestionThread } from "./questionThreadTypeorm"

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

    @OneToOne(() => QuestionThread, { nullable: true })
    @JoinColumn({ name: "question_thread_id" })
    question_thread!: QuestionThread

    @OneToOne(() => AssignmentAnswer, { nullable: true })
    @JoinColumn({ name: "answer_id" })
    answer!: AssignmentAnswer

    @Column({
        type: "enum",
        enum: StudentProgressStatus,
        default: StudentProgressStatus.NOT_DONE
    })
    progress_status!: StudentProgressStatus
}
