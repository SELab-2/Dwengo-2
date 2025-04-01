import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { StudentTypeORM } from "./studentTypeorm";
import { StatusType, Submission } from "../../../../core/entities/submission";

export enum SubmissionStatus {
    NOT_ACCEPTED = "not_accepted",
    ACCEPTED = "accepted",
}

@Entity()
export class SubmissionTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => StudentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "student_id" })
    student!: StudentTypeORM;

    @ManyToOne(() => AssignmentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "assignment_id" })
    assignment!: AssignmentTypeORM;

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
            this.student.id,
            this.assignment.id,
            this.learning_object_id,
            this.time,
            this.contents,
            status,
            this.id,
        );
    }

    public static createTypeORM(
        submission: Submission,
        studentModel: StudentTypeORM,
        assignmentModel: AssignmentTypeORM,
    ): SubmissionTypeORM {
        const submissionModel: SubmissionTypeORM = new SubmissionTypeORM();

        let status: SubmissionStatus;
        if (submission.status == StatusType.ACCEPTED) {
            status = SubmissionStatus.ACCEPTED;
        } else {
            status = SubmissionStatus.NOT_ACCEPTED;
        }

        submissionModel.student = studentModel;
        submissionModel.assignment = assignmentModel;
        submissionModel.learning_object_id = submission.learningObjectId;
        submissionModel.time = submission.time;
        submissionModel.contents = submission.contents;
        submissionModel.progress_status = status;

        return submissionModel;
    }
}
