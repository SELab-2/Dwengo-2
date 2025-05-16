import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { TaskDetails, TaskType } from "../../../../config/taskTypes";
import { Task } from "../../../../core/entities/task";

@Entity()
export class TaskTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => AssignmentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM;

    @Column({ type: "int", width: 3 })
    step!: number;

    @Column({ type: "varchar", length: 150 })
    question!: string;

    @Column({
        type: "enum",
        enum: TaskType,
    })
    type!: TaskType;

    @Column({ type: "json" })
    details!: TaskDetails;

    public static createTaskTypeORM(task: Task, assignmentModel: AssignmentTypeORM): TaskTypeORM {
        const taskTypeORM: TaskTypeORM = new TaskTypeORM();
        taskTypeORM.assignment = assignmentModel;
        taskTypeORM.step = task.step;
        taskTypeORM.question = task.question;
        taskTypeORM.type = task.type;
        taskTypeORM.details = task.details;
        return taskTypeORM;
    }

    public toEntity(): Task {
        return new Task(
            this.assignment.id,
            this.step,
            this.question,
            this.type,
            this.details,
            this.id
        );
    }
}

