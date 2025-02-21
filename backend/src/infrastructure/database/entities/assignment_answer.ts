import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class AssignmentAnswer {
    @PrimaryGeneratedColumn("uuid")
    answer_id!: number

    @Column({ type: "bytea" }) // Equivalent to a blob
    answer!: Buffer
}
