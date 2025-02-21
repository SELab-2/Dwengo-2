import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class StudentQuestion {
    @PrimaryGeneratedColumn("uuid")
    question_id!: number

    @PrimaryGeneratedColumn("uuid")
    question_sub_id!: number

    @Column({ type: "text" })
    question!: string

    @Column({ type: "text", nullable: true })
    answer!: string

    @CreateDateColumn()
    question_date!: Date

    @Column({ type: "date", nullable: true })
    answer_date!: Date
}
