import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, CreateDateColumn } from "typeorm"
import { AssignmentTypeORM } from "./assignmentTypeorm"
import { StudentTypeORM } from "./studentTypeorm"

export enum SubmissionStatus {
    NOT_ACCEPTED = "not_accepted",
    ACCEPTED = "accepted"
}

@Entity()
export class Submission {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => StudentTypeORM)
    @JoinColumn({ name: "student_id" })
    student!: StudentTypeORM

    @OneToOne(() => AssignmentTypeORM)
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM

    @Column({ type: "varchar"}) // In the Dwengo API docs a uuid is a string
    learning_object_id!: string // uuid of corresponding learning object

    @CreateDateColumn()
    time!: Date
    
    @Column({ type: "bytea" }) // Equivalent to a blob
    contents!: Buffer

    @Column({
        type: "enum",
        enum: SubmissionStatus,
        default: SubmissionStatus.ACCEPTED
    })
    progress_status!: SubmissionStatus
}
