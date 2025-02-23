import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, CreateDateColumn } from "typeorm"
import { User } from "./user_typeorm"
import { QuestionThread } from "./question_thread_typeorm"

@Entity()
export class ThreadQuestions {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => QuestionThread)
    @JoinColumn({ name: "thread_id" })
    thread!: QuestionThread

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    sent_by!: User

    @Column({ type: "text" })
    content!: string
}
