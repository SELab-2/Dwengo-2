import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

export enum ThreadVisibility {
    GROUP = "group",
    STUDENT= "student"
}

@Entity()
export class QuestionThread {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "enum",
        enum: ThreadVisibility,
        default: ThreadVisibility.GROUP
    })
    visibility!: ThreadVisibility

    @Column({ type: "boolean" })
    is_closed!: boolean
}
