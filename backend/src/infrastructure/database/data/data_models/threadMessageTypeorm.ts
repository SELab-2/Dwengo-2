import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column, CreateDateColumn } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { QuestionThreadTypeORM } from "./questionThreadTypeorm"

@Entity()
export class ThreadMessageTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => QuestionThreadTypeORM)
    @JoinColumn({ name: "thread_id" })
    thread!: QuestionThreadTypeORM

    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "user_id" })
    sent_by!: UserTypeORM

    @CreateDateColumn()
    sent_at!: Date

    @Column({ type: "text" })
    contents!: string
}
