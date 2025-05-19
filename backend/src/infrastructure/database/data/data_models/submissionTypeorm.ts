import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { TaskTypeORM } from "./taskTypeORM";
import { UserTypeORM } from "./userTypeorm";
import { StatusType, Submission } from "../../../../core/entities/submission";

@Entity()
export class SubmissionTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => UserTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "student_id" })
    user!: UserTypeORM;

    @ManyToOne(() => AssignmentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM;

    @ManyToOne(() => TaskTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "task_id" })
    task!: TaskTypeORM;

    @Column({ type: "varchar" }) // In the Dwengo API docs a uuid is a string
    learning_object_id!: string; // uuid of corresponding learning object

    @CreateDateColumn()
    time!: Date;

    @Column({ type: "bytea" }) // Equivalent to a blob
    contents!: Buffer;

    @Column({
        type: "enum",
        enum: StatusType,
        default: StatusType.NOT_ACCEPTED,
    })
    progress_status!: StatusType;

    public toEntity(): Submission {
        return new Submission(
            this.user.id,
            this.assignment.id,
            this.task.id,
            this.learning_object_id,
            this.time,
            this.contents,
            this.progress_status,
            this.id,
        );
    }

    public static createTypeORM(
        submission: Submission,
        userModel: UserTypeORM,
        assignmentModel: AssignmentTypeORM,
        taskModel: TaskTypeORM,
    ): SubmissionTypeORM {
        const submissionModel: SubmissionTypeORM = new SubmissionTypeORM();
        submissionModel.user = userModel;
        submissionModel.assignment = assignmentModel;
        submissionModel.task = taskModel;
        submissionModel.learning_object_id = submission.learningObjectId;
        submissionModel.time = submission.time;
        submissionModel.contents = submission.contents;
        submissionModel.progress_status = submission.status;

        return submissionModel;
    }
}
