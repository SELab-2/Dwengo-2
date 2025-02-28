import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from "typeorm"
import { AssignmentTypeORM } from "./assignmentTypeorm"
import { StudentTypeORM } from "./studentTypeorm"
import { AssignmentAnswerTypeORM } from "./assignmentAnswerTypeorm"
import { QuestionThreadTypeORM } from "./questionThreadTypeorm"

export enum StudentProgressStatus {
    NOT_DONE = "not_done",
    BUSY = "busy",
    DONE = "done"
}

@Entity()
export class StudentProgressTypeORM {
    @PrimaryColumn()
    super_so_uuid!: string

    @PrimaryColumn()
    so_uuid!: string

    @OneToOne(() => AssignmentTypeORM)
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM

    @OneToOne(() => StudentTypeORM)
    @JoinColumn({ name: "student_id" })
    student!: StudentTypeORM

    @OneToOne(() => QuestionThreadTypeORM, { nullable: true })
    @JoinColumn({ name: "question_thread_id" })
    question_thread!: QuestionThreadTypeORM

    @OneToOne(() => AssignmentAnswerTypeORM, { nullable: true })
    @JoinColumn({ name: "answer_id" })
    answer!: AssignmentAnswerTypeORM

    @Column({
        type: "enum",
        enum: StudentProgressStatus,
        default: StudentProgressStatus.NOT_DONE
    })
    progress_status!: StudentProgressStatus
}
