import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { StudentTypeORM } from "./studentTypeorm"
import { AssignmentTypeORM } from "./assignmentTypeorm"

export enum ThreadVisibility {
    GROUP = "group",
    STUDENT= "student"
}

@Entity()
export class QuestionThreadTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => StudentTypeORM)
        @JoinColumn({ name: "creator_id" })
        student!: StudentTypeORM

    @OneToOne(() => AssignmentTypeORM)
        @JoinColumn({ name: "assignment_id" })
        assignment!: AssignmentTypeORM
    
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
