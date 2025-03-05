import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, CreateDateColumn } from "typeorm"
import { User } from "./userTypeorm"
import { QuestionThread } from "./questionThreadTypeorm"

@Entity()
export class ThreadMessage {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => QuestionThread)
    @JoinColumn({ name: "thread_id" })
    thread!: QuestionThread

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    sent_by!: User

    @CreateDateColumn()
    sent_at!: Date

    @Column({ type: "text" })
    contents!: string
}
