import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { GroupTypeORM } from "./groupTypeorm"
import { AssignmentTypeORM } from "./assignmentTypeorm"

@Entity()
export class AssignmentGroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => GroupTypeORM)
    @JoinColumn({ name: "group_id" })
    group!: GroupTypeORM

    @OneToOne(() => AssignmentTypeORM)
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM
}
