import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from "typeorm"
import { Assignment } from "./assignment_typeorm"
import { Student } from "./student_typeorm"
import { AssignmentAnswer } from "./assignment_answer_typeorm"
import { QuestionThread } from "./question_thread_typeorm"

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
