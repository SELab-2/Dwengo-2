import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Student } from "./studentTypeorm"
import { Assignment } from "./assignmentTypeorm"

export enum ThreadVisibility {
    GROUP = "group",
    STUDENT= "student"
}

@Entity()
export class QuestionThread {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Student)
        @JoinColumn({ name: "creator_id" })
        student!: Student

    @OneToOne(() => Assignment)
        @JoinColumn({ name: "assignment_id" })
        assignment!: Assignment
    
    @Column()
        learning_object_id!: string
    
    @Column({ type: "boolean" })
        is_closed!: boolean
    
    @Column({
        type: "enum",
        enum: ThreadVisibility,
        default: ThreadVisibility.GROUP
    })
    visibility!: ThreadVisibility

}
