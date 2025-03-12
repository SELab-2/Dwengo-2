import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { StudentTypeORM } from "./studentTypeorm"
import { AssignmentTypeORM } from "./assignmentTypeorm"
import { QuestionThread } from "../../../../core/entities/questionThread"
import { VisibilityType } from "../../../../core/entities/questionThread"
import { MessageTypeORM } from "./messageTypeorm"

export enum ThreadVisibility {
    GROUP = "group",
    STUDENT= "student"
}

@Entity()
export class QuestionThreadTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => StudentTypeORM)
        @JoinColumn({ name: "creator_id" })
        student!: StudentTypeORM

    @OneToOne(() => AssignmentTypeORM)
        @JoinColumn({ name: "assignment_id" })
        assignment!: AssignmentTypeORM
    
    @Column()
        learning_object_id!: string
    
    @Column({ type: "boolean" })
        is_closed!: boolean
    
    @Column({
        type: "enum",
        enum: ThreadVisibility,
        default: ThreadVisibility.GROUP
    })
    visibility!: ThreadVisibility

    public static createTypeORM(thread: QuestionThread, studentModel: StudentTypeORM, assignmentModel: AssignmentTypeORM): QuestionThreadTypeORM {
        const threadTypeORM: QuestionThreadTypeORM = new QuestionThreadTypeORM();
        threadTypeORM.assignment = assignmentModel;
        threadTypeORM.student = studentModel;
        threadTypeORM.is_closed = thread.isClosed;
        threadTypeORM.learning_object_id = thread.learningObjectId;

        if (thread.visibility == VisibilityType.GROUP){
            threadTypeORM.visibility = ThreadVisibility.GROUP;
        }else{
            threadTypeORM.visibility = ThreadVisibility.STUDENT;
        }

        return threadTypeORM;
    }
    
    public toEntity(messageModels: MessageTypeORM[]): QuestionThread{
        const messageIds: string[] = messageModels.map((messageModel) => messageModel.id);
        let visibilityType: VisibilityType
        if (this.visibility === ThreadVisibility.GROUP){
            visibilityType = VisibilityType.GROUP
        } else {
            visibilityType = VisibilityType.PRIVATE
        }
        return new QuestionThread(this.student.id, this.assignment.id, this.learning_object_id, this.is_closed, visibilityType, messageIds, this.id );
    }

    public static toPartial(questionThread: Partial<QuestionThread>): Partial<QuestionThreadTypeORM> {
        const threadTypeORM: Partial<QuestionThreadTypeORM> = {};

        // These two fields are the only field we will ever update
        if (questionThread.isClosed) {
            threadTypeORM.is_closed = questionThread.isClosed;
        }
        if (questionThread.visibility) {
            if (questionThread.visibility === VisibilityType.GROUP){
                threadTypeORM.visibility = ThreadVisibility.GROUP;
            }else{
                threadTypeORM.visibility = ThreadVisibility.STUDENT;
            }
        }

        return threadTypeORM
    }

}
