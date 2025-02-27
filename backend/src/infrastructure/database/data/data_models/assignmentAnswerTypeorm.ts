import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class AssignmentAnswer {
    @PrimaryGeneratedColumn("uuid")
    id!: number

    @Column({ type: "bytea" }) // Equivalent to a blob
    answer!: Buffer
}
