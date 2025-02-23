import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, CreateDateColumn } from "typeorm"
import { User } from "./user"
import { QuestionThread } from "./question_thread"

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
