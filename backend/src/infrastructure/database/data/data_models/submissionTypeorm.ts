import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { UserTypeORM } from "./userTypeorm";
import { StatusType, Submission } from "../../../../core/entities/submission";
import { TaskTypeORM } from "./taskTypeORM";

export enum SubmissionStatus {
    NOT_ACCEPTED = "not_accepted",
    ACCEPTED = "accepted",
}

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
        enum: SubmissionStatus,
        default: SubmissionStatus.ACCEPTED,
    })
    progress_status!: SubmissionStatus;

    public toEntity(): Submission {
        let status: StatusType;
        if (this.progress_status == SubmissionStatus.ACCEPTED) {
            status = StatusType.ACCEPTED;
        } else {
            status = StatusType.NOT_ACCEPTED;
        }
        return new Submission(
            this.user.id,
            this.assignment.id,
            this.task.id,
            this.learning_object_id,
            this.time,
            this.contents,
            status,
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

        let status: SubmissionStatus;
        if (submission.status == StatusType.ACCEPTED) {
            status = SubmissionStatus.ACCEPTED;
        } else {
            status = SubmissionStatus.NOT_ACCEPTED;
        }

        submissionModel.user = userModel;
        submissionModel.assignment = assignmentModel;
        submissionModel.task = taskModel;
        submissionModel.learning_object_id = submission.learningObjectId;
        submissionModel.time = submission.time;
        submissionModel.contents = submission.contents;
        submissionModel.progress_status = status;

        return submissionModel;
    }
}
