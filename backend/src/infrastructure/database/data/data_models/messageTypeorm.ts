import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { QuestionThreadTypeORM } from "./questionThreadTypeorm";
import { UserTypeORM } from "./userTypeorm";
import { Message } from "../../../../core/entities/message";

@Entity()
export class MessageTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => QuestionThreadTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "thread_id" })
    thread!: QuestionThreadTypeORM;

    @ManyToOne(() => UserTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    sent_by!: UserTypeORM;

    @CreateDateColumn()
    sent_at!: Date;

    @Column({ type: "text" })
    contents!: string;

    public static createTypeORM(
        message: Message,
        userModel: UserTypeORM,
        threadModel: QuestionThreadTypeORM,
    ): MessageTypeORM {
        const messageTypeORM: MessageTypeORM = new MessageTypeORM();
        messageTypeORM.contents = message.content;
        messageTypeORM.sent_at = message.createdAt;
        messageTypeORM.sent_by = userModel;
        messageTypeORM.thread = threadModel;
        return messageTypeORM;
    }

    public toEntity(): Message {
        return new Message(this.sent_by.id, this.sent_at, this.thread.id, this.contents, this.id);
    }
}
