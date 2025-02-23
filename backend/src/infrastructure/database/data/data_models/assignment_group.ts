import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Group } from "./group"
import { Assignment } from "./assignment"

@Entity()
export class AssignmentGroup {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Group)
    @JoinColumn({ name: "group_id" })
    group!: Group

    @OneToOne(() => Assignment)
    @JoinColumn({ name: "assignment_id" })
    assignment!: Assignment
}
