import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, CreateDateColumn } from "typeorm"
import { Assignment } from "./assignmentTypeorm"
import { Student } from "./studentTypeorm"

export enum SubmissionStatus {
    NOT_ACCEPTED = "not_accepted",
    ACCEPTED = "accepted"
}

@Entity()
export class Submission {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Student)
    @JoinColumn({ name: "student_id" })
    student!: Student

    @OneToOne(() => Assignment)
    @JoinColumn({ name: "assignment_id" })
    assignment!: Assignment

    @Column()
    learning_object_id!: string

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
