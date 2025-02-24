import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Group } from "./group_typeorm"
import { Assignment } from "./assignment_typeorm"

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
