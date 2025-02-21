import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { Group } from "./group"
import { Assignment } from "./assignment"

@Entity()
export class AssignmentGroup {
    @PrimaryColumn()
    @OneToOne(type => Group)
    @JoinColumn()
    group!: Group

    @PrimaryColumn()
    @OneToOne(type => Assignment)
    @JoinColumn()
    assignment!: Assignment
}
