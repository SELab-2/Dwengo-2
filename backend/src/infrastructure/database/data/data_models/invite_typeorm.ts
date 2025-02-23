import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, Column } from "typeorm"
import { User } from "./user_typeorm"
import { Class } from "./class_typeorm"

export enum InviteType {
    TEACHER_TEACHER = "teacher_teacher",
    TEACHER_STUDENT = "teacher_student"
}

@Entity()
export class PendingInvite {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @OneToOne(() => User)
    @JoinColumn({ name: "inviter_id" })
    inviter!: User

    @OneToOne(() => User)
    @JoinColumn({ name: "invitee_id" })
    invitee!: User

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class

    @CreateDateColumn()
    invitation_date!: Date

    @Column({
        type: "enum",
        enum: InviteType
    })
    type!: InviteType
}
