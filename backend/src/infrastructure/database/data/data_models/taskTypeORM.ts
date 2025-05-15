import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { TaskDetails, TaskType } from "../../../../config/taskTypes";

@Entity()
export class TaskTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => AssignmentTypeORM, {cascade: true, onDelete:"CASCADE" })
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM;

    @Column({ type: "int", width: 3 })
    step!: number;

    @Column({ type: "varchar", length: 150})
    question!: string;

    @Column({
        type: "enum",
        enum: TaskType,
    })
    type!: TaskType;

    @Column({ type: "json" })
    details!: TaskDetails;
}

