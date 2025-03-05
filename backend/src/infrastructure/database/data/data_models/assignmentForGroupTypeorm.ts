import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Group } from "./groupTypeorm"
import { Assignment } from "./assignmentTypeorm"

@Entity()
export class AssignmentForGroup {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Group)
    @JoinColumn({ name: "group_id" })
    group!: Group

    @OneToOne(() => Assignment)
    @JoinColumn({ name: "assignment_id" })
    assignment!: Assignment
}
