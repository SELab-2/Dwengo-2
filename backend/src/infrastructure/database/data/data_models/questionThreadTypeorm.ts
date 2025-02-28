import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum QuestionThreadVisibility {
    GROUP = "group",
    STUDENT= "student"
}

@Entity()
export class QuestionThreadTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "enum",
        enum: QuestionThreadVisibility,
        default: QuestionThreadVisibility.GROUP
    })
    visibility!: QuestionThreadVisibility

    @Column({ type: "boolean" })
    is_closed!: boolean
}
